from pydantic import BaseModel, Field


class SexDataEntry(BaseModel):
    cnt: int
    sex: str


class AgeDataEntry(BaseModel):
    age: int
    cnt: int


class ProfessionVisitDataEntry(BaseModel):
    value: int
    text: str
    name: int
