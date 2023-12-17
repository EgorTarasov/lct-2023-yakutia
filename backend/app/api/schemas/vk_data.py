import datetime as dt
from pydantic import BaseModel


class VkGroupInfo(BaseModel):
    id: int
    name: str
    screen_name: str
    type: str
    photo_50: str
    photo_100: str
    photo_200: str


class VkUserInfo(BaseModel):
    user_id: int
    groups: list[VkGroupInfo]


class VkUserDto(BaseModel):
    id: int
    first_name: str
    last_name: str
    bdate: dt.datetime
    sex: str
    city: str

    photo_url: list[VkGroupInfo]
