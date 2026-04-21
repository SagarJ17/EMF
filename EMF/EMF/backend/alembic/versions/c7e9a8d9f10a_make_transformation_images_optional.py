"""Make transformation images optional

Revision ID: c7e9a8d9f10a
Revises: a5f8d9b1c2e3
Create Date: 2026-04-21 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c7e9a8d9f10a'
down_revision: Union[str, None] = 'a5f8d9b1c2e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Explicitly drop NOT NULL constraint on before_image and after_image in postgres native
    op.alter_column('transformations', 'before_image', existing_type=sa.VARCHAR(), nullable=True)
    op.alter_column('transformations', 'after_image', existing_type=sa.VARCHAR(), nullable=True)


def downgrade() -> None:
    # Re-add NOT NULL constraint if reversed
    op.alter_column('transformations', 'after_image', existing_type=sa.VARCHAR(), nullable=False)
    op.alter_column('transformations', 'before_image', existing_type=sa.VARCHAR(), nullable=False)
