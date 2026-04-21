"""Make contact email and message optional

Revision ID: a5f8d9b1c2e3
Revises: 34bb2935a914
Create Date: 2026-04-21 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a5f8d9b1c2e3'
down_revision: Union[str, None] = '34bb2935a914'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop NOT NULL constraint on email and message in contact_messages
    op.alter_column('contact_messages', 'email', existing_type=sa.VARCHAR(length=255), nullable=True)
    op.alter_column('contact_messages', 'message', existing_type=sa.TEXT(), nullable=True)


def downgrade() -> None:
    # Re-add NOT NULL constraint if reversed
    op.alter_column('contact_messages', 'message', existing_type=sa.TEXT(), nullable=False)
    op.alter_column('contact_messages', 'email', existing_type=sa.VARCHAR(length=255), nullable=False)
