"""added_vkData

Revision ID: 020
Revises: 019
Create Date: 2023-12-17 23:08:57.373706

"""
from typing import Optional, Sequence

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "020"
down_revision: Optional[str] = "019"
branch_labels: Optional[Sequence[str]] = None
depends_on: Optional[Sequence[str]] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("vk_users", sa.Column("bdate", sa.DateTime(), nullable=False))
    op.add_column("vk_users", sa.Column("sex", sa.Text(), nullable=False))
    op.add_column("vk_users", sa.Column("city", sa.Text(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("vk_users", "city")
    op.drop_column("vk_users", "sex")
    op.drop_column("vk_users", "bdate")
    # ### end Alembic commands ###
