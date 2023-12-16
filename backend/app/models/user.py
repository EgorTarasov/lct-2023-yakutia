import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin
from .group import VkGroup
from .role import Role


class User(Base, TimestampMixin):
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)

    first_name: Mapped[str] = mapped_column(sa.Text)
    last_name: Mapped[str] = mapped_column(sa.Text)
    email: Mapped[str] = mapped_column(sa.Text)
    password: Mapped[str] = mapped_column(sa.Text)
    role_id: Mapped[int] = mapped_column(sa.Integer, sa.ForeignKey(Role.id))

    role: Mapped[Role] = relationship("Role")

    def __repr__(self) -> str:
        return f"<User {self.id} {self.first_name} {self.last_name} {self.email}>"


user_group_association = sa.Table(
    "user_group_association",
    Base.metadata,
    sa.Column("vk_user_id", sa.Integer, sa.ForeignKey("vk_users.id")),
    sa.Column("vk_group_id", sa.Integer, sa.ForeignKey("vk_groups.id")),
)


class VkUser(Base, TimestampMixin):
    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)

    first_name: Mapped[str] = mapped_column(sa.Text)
    last_name: Mapped[str] = mapped_column(sa.Text)
    photo_url: Mapped[str] = mapped_column(sa.Text)
    groups: Mapped[VkGroup] = relationship(
        "VkGroup", secondary=user_group_association, backref="users"
    )

    def __repr__(self) -> str:
        return f"<VkUser {self.id}>"
