from sqlalchemy import Column, Integer, String, Text
from database.session import Base

class Transformation(Base):
    __tablename__ = "transformations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    result = Column(String, nullable=True)
    quote = Column(Text, nullable=True)
    before_image = Column(String, nullable=True)  # URL to before image (null for video cards)
    after_image = Column(String, nullable=True)   # URL to after image (null for video cards)
    video = Column(String, nullable=True)         # Optional URL to video (null for image cards)
