from .base import Base, TimestampMixin
import typing as tp
import datetime as dt
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship, Mapped, mapped_column


class ExternalCourse(Base, TimestampMixin):
    id: Mapped[str] = mapped_column(sa.Text, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text)
    link: Mapped[str] = mapped_column(sa.Text)
    learning_type: Mapped[list[str]] = mapped_column(ARRAY(sa.Text))
    course_image: Mapped[str] = mapped_column(sa.Text)
    price_all: Mapped[int] = mapped_column(sa.Integer)
    price: Mapped[int] = mapped_column(sa.Integer)
    time_installment: Mapped[tp.Optional[int]] = mapped_column(
        sa.Integer, nullable=True
    )
    date_start: Mapped[dt.datetime] = mapped_column(sa.DateTime, nullable=True)
    portfolio_text: Mapped[str] = mapped_column(sa.Text, nullable=True)
    source: Mapped[str] = mapped_column(sa.Text, nullable=True)

    def __repr__(self) -> str:
        return f"<ExternalCourse(id={self.id}, name={self.name})>"


profession_course_association = sa.Table(
    "profession_course_association",
    Base.metadata,
    sa.Column("profession_id", sa.Integer, sa.ForeignKey("professions.id")),
    sa.Column("external_course_id", sa.Text, sa.ForeignKey("external_courses.id")),
)
