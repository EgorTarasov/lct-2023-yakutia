"""adding_description_to_VKGroup_nullable

Revision ID: 003
Revises: 002
Create Date: 2023-12-16 11:30:52.918991

"""
from typing import Optional, Sequence

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "003"
down_revision: Optional[str] = "002"
branch_labels: Optional[Sequence[str]] = None
depends_on: Optional[Sequence[str]] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("vk_groups", sa.Column("description", sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("vk_groups", "description")
    # ### end Alembic commands ###