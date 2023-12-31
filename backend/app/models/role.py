import typing as tp
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


# class Role(Base):
#     """Справочная информация о ролях в приложении
#     id = 1 name = admin
#     id = 2 name = investor
#     id = 3 name = developer
#     """

#     id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
#     name: Mapped[str] = mapped_column(sa.Text)

#     users: Mapped[tp.List["User"]] = relationship("User", back_populates="role")
