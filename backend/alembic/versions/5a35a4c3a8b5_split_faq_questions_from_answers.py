"""split faq questions from answers

Revision ID: 5a35a4c3a8b5
Revises: 7ffac62b1674
Create Date: 2026-01-31 17:59:55.230080

"""
from typing import Sequence, Union
from pgvector.sqlalchemy import Vector
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5a35a4c3a8b5'
down_revision: Union[str, Sequence[str], None] = '7ffac62b1674'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():
    # 1️⃣ Create faq_questions table
    op.create_table(
        "faq_questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "faq_id",
            sa.Integer(),
            sa.ForeignKey("faqs.id", ondelete="CASCADE"),
            nullable=False
        ),
        sa.Column("question_text", sa.Text(), nullable=True),
        sa.Column("embedding", Vector(3072), nullable=False),
    )

    # 2️⃣ Migrate existing FAQ embeddings
    # Each FAQ's canonical_question becomes a question variant
    op.execute("""
        INSERT INTO faq_questions (faq_id, question_text, embedding)
        SELECT
            id AS faq_id,
            canonical_question AS question_text,
            embedding
        FROM faqs
        WHERE embedding IS NOT NULL
    """)

    # 3️⃣ Drop embedding column from faqs
    op.drop_column("faqs", "embedding")


def downgrade():
    # 1️⃣ Re-add embedding column to faqs
    op.add_column(
        "faqs",
        sa.Column("embedding", Vector(3072), nullable=True)
    )

    # 2️⃣ Restore embeddings from faq_questions (canonical only)
    op.execute("""
        UPDATE faqs f
        SET embedding = fq.embedding
        FROM faq_questions fq
        WHERE fq.faq_id = f.id
    """)

    # 3️⃣ Drop faq_questions table
    op.drop_table("faq_questions")