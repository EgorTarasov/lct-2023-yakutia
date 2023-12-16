from typing import Union

from pydantic import BaseModel, Field, ConfigDict


class Token(BaseModel):
    access_token: str = Field(..., alias="accessToken")
    token_type: str = Field("Bearer", alias="tokenType")

    model_config = ConfigDict(from_attributes=True)


class TokenData(BaseModel):
    email: Union[str, None]
