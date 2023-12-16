import typing as tp
import sqlalchemy as sa
import sqlalchemy.orm as orm
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException


from ...models import User, VkUser, VkGroup

from ..schemas import UserDto, VkUserInfo
from ...services.jwt import UserTokenData
from ..middlewares import get_current_user, get_session


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
    ...
