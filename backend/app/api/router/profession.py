"""
POST /profession/create + 

POST /profession/update/{id} +

GET /profession/all + 

GET /profession/i/{id}
"""

import typing as tp
import sqlalchemy as sa
import sqlalchemy.orm as orm
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException


from ...models import (
    Profession,
    ProfessionDescription,
    ProfessionEmbedding,
)

from ..schemas import (
    ProfessionCreate,
    ProfessionDto,
    ProfessionDescriptionCreate,
    ProfessionDescriptionDto,
    ExternalCourseDto,
    ExternalCourseDto,
)
from ...services.jwt import UserTokenData
from ...services.ml.vectorizer import vectorize
from ...initializers import tokenizer, sbert
from ..middlewares import get_current_user, get_session

router: tp.Final[APIRouter] = APIRouter(prefix="/profession")


@router.post("/create")
async def add_profession(
    payload: ProfessionCreate,
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> ProfessionDto:
    prof_stmt = (
        sa.select(Profession)
        .options(orm.selectinload(Profession.descriptions))
        .options(orm.selectinload(Profession.courses))
        .where(Profession.name == payload.name)
    )

    db_profession: Profession | None = (
        await db.execute(prof_stmt)
    ).scalar_one_or_none()

    if db_profession is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Profession already exists"
        )

    db_profession = Profession(name=payload.name)
    if payload.description is not None and payload.source is not None:
        db_description = ProfessionDescription(
            description=payload.description,
            source=payload.source,
        )
        db_profession.descriptions.append(db_description)

    db.add(db_profession)
    await db.commit()
    await db.refresh(db_profession, ["id"])
    embedding = vectorize(tokenizer, sbert, payload.description)

    db_emedding = ProfessionEmbedding(id=db_profession.id, embeddings=embedding)
    db.add(db_emedding)
    await db.commit()
    return ProfessionDto.model_validate(db_profession)


@router.post("/update/{id}")
async def update_profession(
    payload: ProfessionDescriptionCreate,
    id: int,
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> ProfessionDto:
    prof_stmt = (
        sa.select(Profession)
        .options(orm.selectinload(Profession.descriptions))
        .options(orm.selectinload(Profession.courses))
        .where(Profession.id == id)
    )

    db_profession: Profession | None = (
        await db.execute(prof_stmt)
    ).scalar_one_or_none()

    if db_profession is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profession not found"
        )

    # check if description already exists
    if any(
        [desc.description == payload.description for desc in db_profession.descriptions]
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Description already exists"
        )
    db_description = ProfessionDescription(
        description=payload.description,
        source=payload.source,
        profession_id=id,
    )
    db_profession.descriptions.append(db_description)
    await db.commit()

    return ProfessionDto.model_validate(db_profession)


@router.get("/all")
async def get_all_professions(
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> list[ProfessionDto]:
    prof_stmt = sa.select(Profession).options(
        orm.selectinload(Profession.courses),
        orm.selectinload(Profession.descriptions),
    )

    return [
        ProfessionDto.model_validate(obj)
        for obj in (await db.execute(prof_stmt)).scalars().all()
    ]


@router.get("/i/{id}")
async def get_profession_by_id(
    id: int,
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> ProfessionDto:
    prof_stmt = (
        sa.select(Profession)
        .options(orm.selectinload(Profession.descriptions))
        .options(orm.selectinload(Profession.courses))
        .where(Profession.id == id)
    )

    db_profession: Profession | None = (
        await db.execute(prof_stmt)
    ).scalar_one_or_none()

    if db_profession is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profession not found"
        )

    return ProfessionDto.model_validate(db_profession)
