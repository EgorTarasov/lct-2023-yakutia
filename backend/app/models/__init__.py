from .base import Base
from .user import User, VkUser, user_group_association
from .prediction import group_profession_association
from .profession import Profession, ProfessionDescription, ProfessionEmbedding
from .course import ExternalCourse, profession_course_association
from .group import VkGroup


__all__ = [
    "Base",
    "User",
    "VkUser",
    "VkGroup",
    "Profession",
    "ExternalCourse",
    "ProfessionDescription",
    "ProfessionEmbedding",
]
