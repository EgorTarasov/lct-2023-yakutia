"""removing_images

Revision ID: 002
Revises: 001
Create Date: 2023-12-16 02:58:24.548424

"""
from typing import Optional, Sequence

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Optional[str] = "001"
branch_labels: Optional[Sequence[str]] = None
depends_on: Optional[Sequence[str]] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("vk_groups", "photo_50")
    op.drop_column("vk_groups", "photo_100")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "vk_groups", sa.Column("photo_100", sa.TEXT(), autoincrement=False, nullable=False)
    )
    op.add_column(
        "vk_groups", sa.Column("photo_50", sa.TEXT(), autoincrement=False, nullable=False)
    )
    # ### end Alembic commands ###
