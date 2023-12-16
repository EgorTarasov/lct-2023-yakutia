import logging
from os import access
import typing as tp
import httpx

import sqlalchemy as sa
import sqlalchemy.orm as orm
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm


from ..middlewares.db_session import get_session
from ...services import jwt, password

from ...models import User, Role, VkUser, VkGroup

from ..schemas import Token, UserCreate, VkUserInfo

from app.models.user import User
from ...initializers.settings import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_session),
) -> Token:
    """Вход по почте и паролю"""
    try:
        # stmt = sa.select(User).where(User.email == form_data.username)
        # get User with role_data
        stmt = (
            sa.select(User)
            .options(orm.selectinload(User.role))
            .where(User.email == form_data.username)
        )
        db_user: User | None = (await db.execute(stmt)).unique().scalar_one_or_none()

        if db_user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        if password.PasswordManager.verify_password(
            form_data.password, db_user.password
        ):
            token = jwt.JWTEncoder.create_access_token(
                db_user.id,
            )
            return Token.model_validate(
                {
                    "accessToken": token,
                    "role": db_user.role.name,
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
    except Exception as e:
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )


@router.post("/register")
async def register(
    user: UserCreate,
    db: AsyncSession = Depends(get_session),
):
    """Регистрация нового пользователя"""

    stmt = (
        sa.select(User)
        .options(orm.selectinload(User.role))
        .where(User.email == user.email)
    )
    db_user: User | None = (await db.execute(stmt)).unique().scalar_one_or_none()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    else:
        role_stmt = sa.select(Role).where(Role.id == user.role_id)
        db_role: Role | None = (
            (await db.execute(role_stmt)).unique().scalar_one_or_none()
        )
        if db_role is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role not found",
            )
        db_user = User(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password="",
        )
        db_user.role = db_role
        db_user.password = password.PasswordManager.hash_password(user.password)
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        token = jwt.JWTEncoder.create_access_token(
            db_user.id,
        )
        return Token.model_validate(
            {
                "accessToken": token,
                "role": db_role.name,
            }
        )


async def update_groups(
    db: AsyncSession, client: httpx.AsyncClient, user: VkUser, token: str
):
    # get users group ids
    response = await client.get(
        settings.vk_base_url + "/groups.get",
        headers={"Authorization": f"Bearer {token}"},
        params={"v": "5.199"},
    )
    # FIXME: check response status code

    groups_stmt = sa.select(VkGroup).where(
        VkGroup.id.in_(response.json()["response"]["items"])
    )
    db_groups: list[VkGroup] = [obj[0] for obj in (await db.execute(groups_stmt)).all()]
    # collect groups info
    response = await client.get(
        settings.vk_base_url + "/groups.getById",
        headers={"Authorization": f"Bearer {settings.vk_service_token}"},
        params={
            "group_ids": ",".join(map(str, response.json()["response"]["items"])),
            "fields": "photo_200",
            "v": "5.199",
        },
    )
    # FIXME: check response status code
    groups_info = response.json()["response"]["groups"]
    new_groups: list[VkGroup] = []
    user_groups: list[VkGroup] = []
    # update groups that exists in db and add new groups
    for group_info in groups_info:
        db_group: VkGroup = next(
            (group for group in db_groups if group.id == group_info["id"]), None
        )
        if db_group is None:
            new_groups.append(
                VkGroup(
                    id=group_info["id"],
                    name=group_info["name"],
                    screen_name=group_info["screen_name"],
                    type=group_info["type"],
                    photo_200=group_info["photo_200"],
                )
            )
        else:
            db_group.name = group_info["name"]
            db_group.screen_name = group_info["screen_name"]
            db_group.type = group_info["type"]

            db_group.photo_200 = group_info["photo_200"]
            user_groups.append(db_group)
    db.add_all(new_groups)
    user.groups = user_groups + new_groups
    await db.commit()


@router.post("/vk")
async def auth_vk(
    background_tasks: BackgroundTasks,
    code: str = Query(..., description="Код авторизации"),
    db: AsyncSession = Depends(get_session),
):

    url = settings.vk_token_url.format(
        client_id=settings.vk_client_id,
        vk_secure_token=settings.vk_secure_token,
        redirect_uri=settings.vk_redirect_uri,
        code=code,
    )

    client: tp.Final[httpx.AsyncClient] = httpx.AsyncClient()

    response = await client.get(url)

    access_token = response.json()["access_token"]
    user_id = response.json()["user_id"]
    vk_user_stmt = (
        sa.select(VkUser)
        .options(orm.joinedload(VkUser.groups))
        .where(VkUser.id == user_id)
    )
    db_vk_user: VkUser | None = (
        (await db.execute(vk_user_stmt)).unique().scalar_one_or_none()
    )
    # TODO: separate vk_api calls
    if db_vk_user is None:
        response = await client.get(
            settings.vk_base_url + "/users.get",
            headers={"Authorization": f"Bearer {access_token}"},
            params={"fields": "photo_200", "v": "5.199"},
        )

        user_info = response.json()["response"][0]

        db_vk_user = VkUser(
            id=user_info["id"],
            first_name=user_info["first_name"],
            last_name=user_info["last_name"],
            photo_url=user_info["photo_200"],
        )
        db.add(db_vk_user)
        await db.commit()
        await db.refresh(db_vk_user)
    background_tasks.add_task(update_groups, db, client, db_vk_user, access_token)
    return Token.model_validate(
        {
            "accessToken": jwt.JWTEncoder.create_access_token(db_vk_user.id),
            "tokenType": "Bearer",
        }
    )

    # response = await httpx_client.get(url)
    # access_token = response.json()["access_token"]
    # user_id = response.json()["user_id"]
    # vk_user_stmt = (
    #     sa.select(VkUser)
    #     .options(orm.joinedload(VkUser.groups))
    #     .where(VkUser.user_id == user_id)
    # )
    # db_vk_user: VkUser | None = (
    #     (await db.execute(vk_user_stmt)).unique().scalar_one_or_none()
    # )
    # if db_vk_user is None:
    #     response = await httpx_client.get(
    #         settings.vk_base_url + "/users.get",
    #         headers={"Authorization": f"Bearer {access_token}"},
    #         params={"user_ids": user_id, "fields": "photo_200"},
    #     )
    #     user_info = response.json()["response"][0]
    #     db_vk_user = VkUser(
    #         user_id=user_info["id"],
    #         first_name=user_info["first_name"],
    #         last_name=user_info["last_name"],
    #         photo_url=user_info["photo_200"],
    #     )

    # # get users group ids
    # response = await httpx_client.get(
    #     settings.vk_base_url + "/groups.get",
    #     headers={"Authorization": f"Bearer {access_token}"},
    # )

    # # collect groups info
    # response = await httpx_client.get(
    #     settings.vk_base_url + "/groups.getById",
    #     headers={"Authorization": f"Bearer {access_token}"},
    #     params={
    #         "group_ids": ",".join(map(str, response.json()["response"]["items"])),
    #         "fields": "photo_200",
    #     },
    # )
    # groups_info = response.json()["response"]
