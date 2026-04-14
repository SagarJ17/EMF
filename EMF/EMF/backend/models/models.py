from database.session import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func


class UserLead(Base):
    __tablename__ = "users_leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    goal = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    goal = Column(String(255), nullable=True)
    preferred_time = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    platform = Column(String(50), nullable=False)  # youtube / instagram / manual
    url = Column(String(500), nullable=False)
    thumbnail = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True)
    value = Column(Text, nullable=True)
