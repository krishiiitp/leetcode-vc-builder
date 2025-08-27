from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from typing import Optional
from core.database import Base

class Contest(Base):
    __tablename__ = "contests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    user = relationship("User", back_populates="contests")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    attempted: Mapped[bool] = mapped_column(Boolean, default=False)
    problems: Mapped[list[str]] = mapped_column(ARRAY(String))
    topic: Mapped[str] = mapped_column(String)

    def __repr__(self):
        return f"<Contest(id={self.id}, user_id={self.user_id}, topic='{self.topic}')>"