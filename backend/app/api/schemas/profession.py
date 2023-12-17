from pydantic import BaseModel, ConfigDict, Field
from .course import ExternalCourseDto


class ProfessionDescriptionCreate(BaseModel):
    description: str
    source: str


class ProfessionDescriptionDto(BaseModel):
    id: int
    profession_id: int
    description: str
    source: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class ProfessionCreate(BaseModel):
    name: str
    description: str
    source: str


class ProfessionDto(BaseModel):
    id: int
    name: str
    descriptions: list[ProfessionDescriptionDto] = []
    courses: list[ExternalCourseDto | None] = Field(default_factory=list)

    model_config = ConfigDict(
        from_attributes=True,
    )
