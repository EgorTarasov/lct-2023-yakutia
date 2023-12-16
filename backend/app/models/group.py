from .base import Base, TimestampMixin
import sqlalchemy as sa
from sqlalchemy.orm import relationship, Mapped, mapped_column


class VkGroup(Base, TimestampMixin):
    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text)
    screen_name: Mapped[str] = mapped_column(sa.Text)
    type: Mapped[str] = mapped_column(sa.Text)
    photo_200: Mapped[str] = mapped_column(sa.Text)

    def __repr__(self) -> str:
        return f"<VkGroup {self.id} {self.name} {self.screen_name} {self.type}>"
