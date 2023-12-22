import json
import typing as tp
import sqlalchemy as sa
import sqlalchemy.orm as orm
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException


from ...models import User, VkUser, VkGroup, Profession, ProfessionDescription

from ..schemas import UserDto, ProfessionDto, VkUserDto
from ...services.jwt import UserTokenData
from ..middlewares import get_current_user, get_session
from ...initializers import sbert, tokenizer
from ...services.ml import run


router: tp.Final[APIRouter] = APIRouter(prefix="/user")


@router.get("/me")
async def get_user(
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> VkUserDto:
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
    logging.info(f"/me VkUserDto<id={db_user.id}>")
    return VkUserDto.model_validate(db_user)


@router.get("/pred")
async def get_profesions(
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> list[ProfessionDto]:

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
    logging.info(f"/pred User<id={db_user.id}>")
    user_groups = {
        group.name: {"description": group.description, "embeddings": group.embeddings}
        for group in db_user.groups
    }

    prof_stmt = sa.select(Profession).options(
        orm.selectinload(Profession.descriptions),
        orm.selectinload(Profession.embeddings),
    )

    db_professions: list[Profession] = [
        obj for obj in (await db.execute(prof_stmt)).scalars().all()
    ]

    professions = [
        {
            "id": obj.id,
            "name": obj.name,
            "description": obj.descriptions[0].description,
            "embeddings": obj.embeddings[0].embeddings,  # type: ignore
        }
        for obj in db_professions
    ]

    result = run.inference(user_groups, professions)[:5]  # type: ignore

    recomendations_stmt = (
        sa.select(Profession)
        .options(
            orm.selectinload(Profession.courses),
            orm.selectinload(Profession.descriptions),
        )
        .where(Profession.name.in_(result))
    )

    db_professions = [
        obj for obj in (await db.execute(recomendations_stmt)).scalars().all()
    ]

    return [ProfessionDto.model_validate(obj) for obj in db_professions]
