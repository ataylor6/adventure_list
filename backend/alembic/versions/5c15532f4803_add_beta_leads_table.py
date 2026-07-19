"""create beta_leads table

Revision ID: 5c15532f4803
Revises:
Create Date: 2026-07-19 15:13:17.565285

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "5c15532f4803"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "beta_leads",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("username", sa.String(length=64), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_beta_leads_email"), "beta_leads", ["email"], unique=True)
    op.create_index(op.f("ix_beta_leads_username"), "beta_leads", ["username"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_beta_leads_username"), table_name="beta_leads")
    op.drop_index(op.f("ix_beta_leads_email"), table_name="beta_leads")
    op.drop_table("beta_leads")
