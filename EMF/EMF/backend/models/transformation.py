from sqlalchemy import Column, Integer, String, Text
from database.session import Base

class Transformation(Base):
    __tablename__ = "transformations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    result = Column(String, nullable=False)
    quote = Column(Text, nullable=True)
    before_image = Column(String, nullable=False) # URL to before image
    after_image = Column(String, nullable=False) # URL to after image
    video = Column(String, nullable=True) # Optional URL to video
