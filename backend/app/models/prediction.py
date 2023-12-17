from .base import Base, TimestampMixin
import sqlalchemy as sa
from sqlalchemy.orm import relationship, Mapped, mapped_column


# class GroupPrediction(Base):
#     id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
#     group_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey("vk_groups.id"))

group_profession_association = sa.Table(
    "group_profession_association",
    Base.metadata,
    sa.Column("profession_id", sa.Integer, sa.ForeignKey("professions.id")),
    sa.Column("vk_group_id", sa.Integer, sa.ForeignKey("vk_groups.id")),
)
