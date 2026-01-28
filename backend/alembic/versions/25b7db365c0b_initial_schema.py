"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-01-28

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # enable pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # USERS
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('email', sa.String(), unique=True, nullable=False),
        sa.Column('created', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # CHAT SESSIONS
    op.create_table(
        'chat_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    # CHAT MESSAGES
    op.create_table(
        'chat_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('chat_sessions.id')),
        sa.Column('role', sa.String()),
        sa.Column('content', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    # DOCUMENTS
    op.create_table(
        'documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('source_type', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # DOCUMENT CHUNKS
    op.create_table(
        'document_chunks',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('documents.id', ondelete='CASCADE')),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('embedding', Vector(3072)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # FAQ (PGVECTOR)
    op.create_table(
        'faqs',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('canonical_question', sa.Text(), unique=True, nullable=False),
        sa.Column('answer_en', sa.Text(), nullable=False),
        sa.Column('embedding', Vector(3072), nullable=False)
    )

    # ESCALATIONS
    op.create_table(
        'escalations',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('chat_sessions.id'), nullable=False),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('bot_answer', sa.Text()),
        sa.Column('admin_answer', sa.Text()),
        sa.Column('confidence', sa.Integer()),
        sa.Column('status', sa.String(), server_default="open"),
        sa.Column('user_feedback', sa.Text()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('resolved_at', sa.DateTime(timezone=True))
    )


def downgrade() -> None:
    op.drop_table('escalations')
    op.drop_table('faqs')
    op.drop_table('document_chunks')
    op.drop_table('documents')
    op.drop_table('chat_messages')
    op.drop_table('chat_sessions')
    op.drop_table('users')
