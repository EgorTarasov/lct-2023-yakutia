import typing as tp
import sqlalchemy as sa
import sqlalchemy.orm as orm
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException


from ...models import ExternalCourse, Profession
from ..schemas import ExternalCourseDto, ExternalCourseCreate

from ...services.jwt import UserTokenData
from ...services.ml.vectorizer import vectorize
from ...initializers import tokenizer, sbert
from ..middlewares import get_current_user, get_session

router: tp.Final[APIRouter] = APIRouter(prefix="/course")


@router.post("/create")
async def add_course(
    payload: ExternalCourseCreate,
    user: UserTokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> ExternalCourseDto:
    course_stmt = sa.select(ExternalCourse).where(ExternalCourse.id == payload.id)
    db_course: ExternalCourse | None = (await db.execute(course_stmt)).unique().scalar()
    if db_course:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Course with this id already exists",
        )
    course = ExternalCourse(
        id=payload.id,
        name=payload.name,
        link=payload.link,
        learning_type=payload.learning_type,
        course_image=payload.course_image,
        price_all=payload.price_all,
        price=payload.price,
        time_installment=payload.time_installment,
        date_start=payload.date_start,
        portfolio_text=payload.portfolio_text,
    )

    prof_stmt = (
        sa.select(Profession)
        .options(orm.joinedload(Profession.courses))
        .where(Profession.name.in_(payload.professions_names))
    )
    db_professions: list[Profession] = [
        obj for obj in (await db.execute(prof_stmt)).unique().scalars().all()
    ]
    for profession in db_professions:
        if course not in profession.courses:
            profession.courses.append(course)

    db.add(course)
    await db.commit()
    return ExternalCourseDto.model_validate(payload)
