import typing as tp
import datetime as dt
from pydantic import BaseModel, Field, ConfigDict


class ExternalCourseDto(BaseModel):
    id: str
    name: str
    link: str
    learning_type: list[str]
    course_image: str
    price_all: int
    price: float
    time_installment: tp.Optional[int]
    date_start: tp.Optional[dt.datetime]
    portfolio_text: tp.Optional[str]
    source: tp.Optional[str]

    model_config = ConfigDict(
        from_attributes=True,
    )


class ExternalCourseCreate(BaseModel):
    id: str
    name: str
    link: str
    learning_type: list[str] = Field(..., alias="learningtype")
    course_image: str = Field(..., alias="courseImage")
    price_all: int = Field(..., alias="priceAll")
    price: float
    time_installment: tp.Optional[int] = Field(..., alias="timeInstallment")
    date_start: tp.Optional[dt.datetime] = Field(..., alias="dateStart")
    portfolio_text: tp.Optional[str] = Field(..., alias="portfolioText")
    source: tp.Optional[str]
    professions_names: list[str] = Field(..., alias="professionsNames")
