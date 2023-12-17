"""added_professions

Revision ID: 004
Revises: 003
Create Date: 2023-12-16 11:57:20.364124

"""
from typing import Optional, Sequence

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "004"
down_revision: Optional[str] = "003"
branch_labels: Optional[Sequence[str]] = None
depends_on: Optional[Sequence[str]] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "professions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "group_profession_association",
        sa.Column("profession_id", sa.Integer(), nullable=True),
        sa.Column("vk_group_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["profession_id"],
            ["professions.id"],
        ),
        sa.ForeignKeyConstraint(
            ["vk_group_id"],
            ["vk_groups.id"],
        ),
    )
    op.create_table(
        "profession_descriptions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("profession_id", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("source", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(
            ["profession_id"],
            ["professions.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("profession_descriptions")
    op.drop_table("group_profession_association")
    op.drop_table("professions")
    # ### end Alembic commands ###
