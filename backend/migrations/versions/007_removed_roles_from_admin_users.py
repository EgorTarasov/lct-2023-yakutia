"""removed_roles_from_admin_users

Revision ID: 007
Revises: 006
Create Date: 2023-12-16 13:34:10.160320

"""
from typing import Optional, Sequence

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "007"
down_revision: Optional[str] = "006"
branch_labels: Optional[Sequence[str]] = None
depends_on: Optional[Sequence[str]] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("roles")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "roles",
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column("name", sa.TEXT(), autoincrement=False, nullable=False),
        sa.PrimaryKeyConstraint("id", name="roles_pkey"),
    )
    # ### end Alembic commands ###
