"""Add Transformations table

Revision ID: 6c6aa86bfd59
Revises: 
Create Date: 2026-04-11 12:03:06.669207

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6c6aa86bfd59'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'transformations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('result', sa.String(), nullable=True),
        sa.Column('quote', sa.Text(), nullable=True),
        sa.Column('before_image', sa.String(), nullable=True),
        sa.Column('after_image', sa.String(), nullable=True),
        sa.Column('video', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_transformations_id'), 'transformations', ['id'], unique=False)
    op.create_index(op.f('ix_transformations_name'), 'transformations', ['name'], unique=False)

    # Also create the base tables that models.py expects (users_leads, bookings, contact_messages, reviews, videos)
    op.create_table(
        'users_leads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('goal', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_leads_id'), 'users_leads', ['id'], unique=False)
    op.create_index(op.f('ix_users_leads_email'), 'users_leads', ['email'], unique=False)

    op.create_table(
        'bookings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('goal', sa.String(length=255), nullable=True),
        sa.Column('preferred_time', sa.String(length=100), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_bookings_id'), 'bookings', ['id'], unique=False)

    op.create_table(
        'contact_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),   # mandatory
        sa.Column('email', sa.String(length=255), nullable=True),   # optional
        sa.Column('message', sa.Text(), nullable=True),             # optional
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_contact_messages_id'), 'contact_messages', ['id'], unique=False)

    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_reviews_id'), 'reviews', ['id'], unique=False)

    op.create_table(
        'videos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('platform', sa.String(length=50), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('thumbnail', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_videos_id'), 'videos', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_videos_id'), table_name='videos')
    op.drop_table('videos')
    op.drop_index(op.f('ix_reviews_id'), table_name='reviews')
    op.drop_table('reviews')
    op.drop_index(op.f('ix_contact_messages_id'), table_name='contact_messages')
    op.drop_table('contact_messages')
    op.drop_index(op.f('ix_bookings_id'), table_name='bookings')
    op.drop_table('bookings')
    op.drop_index(op.f('ix_users_leads_email'), table_name='users_leads')
    op.drop_index(op.f('ix_users_leads_id'), table_name='users_leads')
    op.drop_table('users_leads')
    op.drop_index(op.f('ix_transformations_name'), table_name='transformations')
    op.drop_index(op.f('ix_transformations_id'), table_name='transformations')
    op.drop_table('transformations')
