import typing as tp
import datetime as dt
import sqlalchemy as sa
import sqlalchemy.orm as orm
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException


from ...models import VkUser

from ..schemas import VkUserDto
from ...services.jwt import UserTokenData
from ...services.ml.vectorizer import vectorize
from ..middlewares import get_current_user, get_session

router: tp.Final[APIRouter] = APIRouter(prefix="/stats")


# user/age

# user/city
# user/sex


@router.get("/sex")
async def get_sex_data(
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """


    {
        age: 18
        cnt: 12313
        sex: женский / мужской
    }

    """

    stmt = sa.select(VkUser.sex, sa.func.count(VkUser.id)).group_by(
        VkUser.id, VkUser.sex
    )

    results = (await db.execute(stmt)).all()

    return {key: value for key, value in results}


@router.get("/age")
async def get_age_group(
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    current_year = sa.extract("year", sa.func.current_date())
    birth_year = sa.extract("year", VkUser.bdate)
    age = current_year - birth_year

    stmt = sa.select(age, sa.func.count(VkUser.id)).group_by(age)

    results = (await db.execute(stmt)).all()

    return {key: value for key, value in results}
