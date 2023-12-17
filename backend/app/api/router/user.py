import json
import typing as tp
import sqlalchemy as sa
import sqlalchemy.orm as orm
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException


from ...models import User, VkUser, VkGroup, Profession, ProfessionDescription

from ..schemas import UserDto, VkUserInfo
from ...services.jwt import UserTokenData
from ..middlewares import get_current_user, get_session
from ...initializers import sbert, tokenizer
from ...services.ml import run


router: tp.Final[APIRouter] = APIRouter(prefix="/user")


@router.get("/me")
async def get_user(
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    stmt = (
        sa.select(VkUser)
        .options(orm.selectinload(VkUser.groups))
        .where(VkUser.id == user.user_id)
    )
    db_user: VkUser | None = (await db.execute(stmt)).unique().scalar()
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    logging.info(f"/me User<id={db_user.id}>")
    return UserDto.model_validate(db_user)


@router.get("/pred")
async def get_profesions(
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    # get users group and put it into dict with format:
    # {group_id: {group_name: group_name, description: description}}

    user_stmt = (
        sa.select(VkUser)
        .options(orm.selectinload(VkUser.groups))
        .where(VkUser.id == user.user_id)
    )
    db_user: VkUser | None = (await db.execute(user_stmt)).unique().scalar()
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if db_user.groups is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Groups not found",
        )
    logging.info(f"/me User<id={db_user.id}>")
    user_groups = {
        group.name: {"description": group.description, "embeddings": group.embeddings}
        for group in db_user.groups
    }

    # select all professions from db and assemble class dict

    prof_stmt = sa.select(Profession).options(
        orm.selectinload(Profession.descriptions),
        orm.selectinload(Profession.embeddings),
    )

    db_professions = [
        {
            "id": obj.id,
            "name": obj.name,
            "description": obj.descriptions[0].description,
            "embeddings": obj.embeddings[0].embeddings,
        }
        for obj in (await db.execute(prof_stmt)).scalars().all()
    ]
    with open("test_prof.json", "w") as f:
        json.dump(db_professions, f, indent=4, ensure_ascii=False)
    with open("test_groups.json", "w") as f:
        json.dump(user_groups, f, indent=4, ensure_ascii=False)

    # a = run.inference(user_groups, db_professions)
    return {"test": "ok"}
