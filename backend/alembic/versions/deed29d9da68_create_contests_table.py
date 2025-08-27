"""Create contests table

Revision ID: deed29d9da68
Revises: 09fd2d80c5c2
Create Date: 2025-08-22 23:29:37.567932

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql # Important for ARRAY type

# revision identifiers, used by Alembic.
revision: str = 'deed29d9da68'
down_revision: Union[str, Sequence[str], None] = '09fd2d80c5c2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands to create the 'contests' table ###
    op.create_table(
        'contests',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column(
            'user_id',
            sa.Integer(),
            sa.ForeignKey('users.id', ondelete='SET NULL'), # Foreign key with ondelete
            nullable=True # user_id can be NULL if user is deleted
        ),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('attempted', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('problems', postgresql.ARRAY(sa.String()), nullable=False), # PostgreSQL specific ARRAY type
        sa.Column('topic', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands to drop the 'contests' table ###
    op.drop_table('contests')
    # ### end Alembic commands ###