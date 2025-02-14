from sqlalchemy import Column, Integer, String, Float, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base

class Industry(Base):
    __tablename__ = "industry"

    industry_id = Column(Integer, primary_key=True, unique=True)
    industry_name = Column(String, nullable=False)
    industry_type = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    password_hash = Column(String, nullable=False)

    __table_args__ = (
        CheckConstraint(
            industry_type.in_(['Manufacturing Unit', 'Recycling Plant', 'Landfill']),
            name='valid_industry_type'
        ),
    )

class Product(Base):
    __tablename__ = "product"

    product_id = Column(Integer, primary_key=True, unique=True)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    producing_industry_id = Column(Integer, ForeignKey("industry.industry_id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        CheckConstraint(quantity > 0, name='positive_quantity'),
        CheckConstraint(price_per_unit > 0, name='positive_price'),
    )

class Transaction(Base):
    __tablename__ = "transaction"

    consignment_id = Column(Integer, primary_key=True, unique=True)
    producing_industry_id = Column(Integer, ForeignKey("industry.industry_id", ondelete="CASCADE"), nullable=False)
    consuming_industry_id = Column(Integer, ForeignKey("industry.industry_id", ondelete="CASCADE"), nullable=False)
    quantity_purchased = Column(Integer, nullable=False)
    price_per_unit = Column(Float, nullable=False)

    __table_args__ = (
        CheckConstraint(quantity_purchased > 0, name='positive_quantity_purchased'),
    )
