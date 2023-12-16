from .base import Base, TimestampMixin
from .group import VkGroup
import sqlalchemy as sa
from sqlalchemy.orm import relationship, Mapped, mapped_column


class ProfessionDescription(Base, TimestampMixin):
    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    profession_id: Mapped[int] = mapped_column(
        sa.Integer, sa.ForeignKey("professions.id")
    )
    description: Mapped[str] = mapped_column(sa.Text)
    source: Mapped[str] = mapped_column(sa.Text)

    def __repr__(self) -> str:
        return f"<ProfessionDescription(id={self.id}, profession_id={self.profession_id}, description={self.description}, source={self.source})>"


class Profession(Base, TimestampMixin):
    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text)

    descriptions: Mapped[list[ProfessionDescription]] = relationship(
        "ProfessionDescription"
    )
    predictions: Mapped[VkGroup] = relationship(
        "VkGroup", secondary="group_profession_association"
    )

    def __repr__(self) -> str:
        return f"<Profession(id={self.id}, name={self.name})>"
