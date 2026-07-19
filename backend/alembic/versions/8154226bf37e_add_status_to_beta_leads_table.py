"""add status to beta_leads table

Revision ID: 8154226bf37e
Revises: 5c15532f4803
Create Date: 2026-07-19 15:58:49.740589

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "8154226bf37e"
down_revision: Union[str, None] = "5c15532f4803"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # server_default fills existing rows, then NOT NULL is valid
    op.add_column(
        "beta_leads",
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    # optional: stop forcing the DB default on future inserts (ORM will set it)
    op.alter_column("beta_leads", "completed", server_default=None)


def downgrade() -> None:
    op.drop_column("beta_leads", "completed")
