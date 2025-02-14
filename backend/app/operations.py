from sqlalchemy.orm import Session
from models import models
from schemas import schemas
from auth_handler import get_password_hash, verify_password
from fastapi import HTTPException
from math import sqrt
from typing import List

def get_industry(db: Session, industry_id: int):
    return db.query(models.Industry).filter(models.Industry.industry_id == industry_id).first()

def get_industry_by_name(db: Session, industry_name: str):
    return db.query(models.Industry).filter(models.Industry.industry_name == industry_name).first()

def get_industries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Industry).offset(skip).limit(limit).all()

def create_industry(db: Session, industry: schemas.IndustryCreate):
    hashed_password = get_password_hash(industry.password)
    db_industry = models.Industry(
        industry_name=industry.industry_name,
        industry_type=industry.industry_type,
        contact_number=industry.contact_number,
        latitude=industry.latitude,
        longitude=industry.longitude,
        password_hash=hashed_password
    )
    db.add(db_industry)
    db.commit()
    db.refresh(db_industry)
    return db_industry

def authenticate_industry(db: Session, industry_id: int, password: str):
    industry = get_industry(db, industry_id)
    if not industry:
        return False
    if not verify_password(password, industry.password_hash):
        return False
    return industry

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    # Verify product availability and update quantity
    product = db.query(models.Product).filter(
        models.Product.producing_industry_id == transaction.producing_industry_id
    ).first()
    
    if not product or product.quantity < transaction.quantity_purchased:
        raise HTTPException(status_code=400, detail="Insufficient product quantity")
    
    product.quantity -= transaction.quantity_purchased
    
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def calculate_euclidean_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Euclidean distance between two points on Earth."""
    return sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)

def search_products(
    db: Session,
    consumer_lat: float,
    consumer_lon: float,
    product_name: str,
    required_quantity: int
) -> List[dict]:
    # Query products with their producing industries
    products = (
        db.query(models.Product, models.Industry)
        .join(models.Industry, models.Product.producing_industry_id == models.Industry.industry_id)
        .filter(models.Product.product_name.ilike(f"%{product_name}%"))
        .filter(models.Product.quantity >= required_quantity)
        .all()
    )

    # Calculate distances and create result objects
    results = []
    for product, industry in products:
        distance = calculate_euclidean_distance(
            consumer_lat, consumer_lon,
            industry.latitude, industry.longitude
        )
        
        results.append({
            "product_id": product.product_id,
            "product_name": product.product_name,
            "quantity": product.quantity,
            "price_per_unit": product.price_per_unit,
            "industry_name": industry.industry_name,
            "distance_km": round(distance * 111, 2)  # Convert to approximate kilometers
        })

    # Sort results by distance
    return sorted(results, key=lambda x: x["distance_km"])

def book_product(db: Session, consumer_id: int, booking: schemas.BookingRequest) -> dict:
    # Get the product and verify availability
    product = db.query(models.Product).filter(models.Product.product_id == booking.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.quantity < booking.quantity_requested:
        raise HTTPException(status_code=400, detail="Insufficient quantity available")

    # Get the last consignment ID
    last_transaction = db.query(models.Transaction).order_by(
        models.Transaction.consignment_id.desc()
    ).first()
    new_consignment_id = (last_transaction.consignment_id + 1) if last_transaction else 1

    # Create transaction
    transaction = models.Transaction(
        consignment_id=new_consignment_id,
        producing_industry_id=product.producing_industry_id,
        consuming_industry_id=consumer_id,
        quantity_purchased=booking.quantity_requested,
        price_per_unit=product.price_per_unit
    )

    # Update product quantity
    product.quantity -= booking.quantity_requested
    if product.quantity == 0:
        db.delete(product)
    
    db.add(transaction)
    db.commit()
    
    return {
        "consignment_id": new_consignment_id,
        "message": f"Successfully booked {booking.quantity_requested} units of product {booking.product_id}"
    }