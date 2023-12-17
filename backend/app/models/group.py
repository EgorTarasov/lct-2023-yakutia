from .base import Base, TimestampMixin
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY, REAL
from sqlalchemy.orm import relationship, Mapped, mapped_column


class VkGroup(Base, TimestampMixin):
    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text)
    description: Mapped[str] = mapped_column(sa.Text, nullable=True)
    screen_name: Mapped[str] = mapped_column(sa.Text)
    type: Mapped[str] = mapped_column(sa.Text)
    photo_200: Mapped[str] = mapped_column(sa.Text)

    embeddings: Mapped[list[float]] = mapped_column(ARRAY(REAL))

    def __repr__(self) -> str:
        return f"<VkGroup {self.id} {self.name} {self.screen_name} {self.type}>"
