"""removed_roles_from_admin_users

Revision ID: 006
Revises: 005
Create Date: 2023-12-16 13:32:18.523956

"""
from typing import Optional, Sequence

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "006"
down_revision: Optional[str] = "005"
branch_labels: Optional[Sequence[str]] = None
depends_on: Optional[Sequence[str]] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("users_role_id_fkey", "users", type_="foreignkey")
    op.drop_column("users", "role_id")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("users", sa.Column("role_id", sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_foreign_key("users_role_id_fkey", "users", "roles", ["role_id"], ["id"])
    # ### end Alembic commands ###
