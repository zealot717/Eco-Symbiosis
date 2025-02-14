from pydantic import BaseModel, validator
from typing import Optional, List

class IndustryBase(BaseModel):
    industry_name: str
    industry_type: str
    contact_number: str
    latitude: float
    longitude: float

    @validator('industry_type')
    def validate_industry_type(cls, v):
        valid_types = ['Manufacturing Unit', 'Recycling Plant', 'Landfill']
        if v not in valid_types:
            raise ValueError(f'Industry type must be one of {valid_types}')
        return v

class IndustryCreate(IndustryBase):
    password: str

class IndustryLogin(BaseModel):
    industry_id: int
    password: str

class Industry(IndustryBase):
    industry_id: int

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    product_name: str
    quantity: int
    price_per_unit: float
    producing_industry_id: int

    @validator('quantity', 'price_per_unit')
    def validate_positive(cls, v):
        if v <= 0:
            raise ValueError('Value must be positive')
        return v

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    product_id: int

    class Config:
        orm_mode = True

class ProductSearchResult(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price_per_unit: float
    industry_name: str
    distance_km: float

    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    producing_industry_id: int
    consuming_industry_id: int
    quantity_purchased: int
    price_per_unit: float

    @validator('quantity_purchased')
    def validate_positive_quantity(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    consignment_id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class BookingRequest(BaseModel):
    product_id: int
    quantity_requested: int

    @validator('quantity_requested')
    def validate_positive_quantity(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v

class BookingResponse(BaseModel):
    consignment_id: int
    message: str