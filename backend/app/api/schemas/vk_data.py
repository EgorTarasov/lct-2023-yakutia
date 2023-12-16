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
