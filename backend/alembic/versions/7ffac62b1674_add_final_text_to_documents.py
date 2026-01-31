"""add final_text to documents

Revision ID: 7ffac62b1674
Revises: 0001_initial
Create Date: 2026-01-31 13:13:52.593040

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7ffac62b1674'
down_revision: Union[str, Sequence[str], None] = '0001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("documents", sa.Column("final_text",sa.Text(),nullable=True))

    op.execute(
        "UPDATE documents SET final_text = '' WHERE final_text IS NULL"
    )

    op.alter_column("documents","final_text",nullable=False)

    op.add_column(
        "documents",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=True
        )
    )





def downgrade() -> None:
    op.drop_column("documents", "updated_at")
    op.drop_column("documents", "final_text")

