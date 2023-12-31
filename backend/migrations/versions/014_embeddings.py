"""embeddings

Revision ID: 014
Revises: 013
Create Date: 2023-12-17 14:17:23.931948

"""
from typing import Optional, Sequence

import sqlalchemy as sa
from alembic import op

from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "014"
down_revision: Optional[str] = "013"
branch_labels: Optional[Sequence[str]] = None
depends_on: Optional[Sequence[str]] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("vk_group_embedings")
    op.add_column(
        "vk_groups", sa.Column("eembeddings", postgresql.ARRAY(sa.REAL()), nullable=False)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("vk_groups", "eembeddings")
    op.create_table(
        "vk_group_embedings",
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            postgresql.TIMESTAMP(),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("embeddings", postgresql.ARRAY(sa.REAL()), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(["id"], ["vk_groups.id"], name="vk_group_embedings_id_fkey"),
        sa.PrimaryKeyConstraint("id", name="vk_group_embedings_pkey"),
    )
    # ### end Alembic commands ###
