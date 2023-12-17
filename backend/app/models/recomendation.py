from .base import Base, TimestampMixin
from .user import VkUser
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .profession import Profession


class ProfessionVisit(Base, TimestampMixin):
    user_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("vk_users.id"), primary_key=True
    )
    profession_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("professions.id"), primary_key=True
    )

    user: Mapped[VkUser] = relationship("VkUser")
    profession: Mapped[Profession] = relationship("Profession")


class ProfessionRecomendation(Base, TimestampMixin):
    user_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("vk_users.id"), primary_key=True
    )
    profession_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("professions.id"), primary_key=True
    )
    rating: Mapped[int] = mapped_column(sa.Integer)  # 1 - 5

    user: Mapped[VkUser] = relationship("VkUser")
    profession: Mapped[Profession] = relationship("Profession")
