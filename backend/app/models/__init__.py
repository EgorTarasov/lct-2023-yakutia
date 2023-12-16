from .base import Base
from .user import User, VkUser, user_group_association
from .prediction import group_profession_association
from .profession import Profession, ProfessionDescription

from .group import VkGroup


__all__ = [
    "Base",
    "User",
    "VkUser",
    "VkGroup",
    "Profession",
    "ProfessionDescription",
]
