from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Union

from app.database import engine, get_db
from app.models import models
from app.schemas import schemas
from app.operations import operations
from app.auth_handler import (
    create_access_token,
    get_current_industry,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoSymbiosis API")

@app.post("/signup", response_model=schemas.Industry)
def signup(
    industry: schemas.IndustryCreate,
    db: Session = Depends(get_db)
):
    # Check if the industry already exists
    existing_industry = operations.get_industry_by_name(db, industry.industry_name)
    if existing_industry:
        raise HTTPException(status_code=400, detail="Industry already registered")
    
    return operations.create_industry(db=db, industry=industry)

@app.post("/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    industry = operations.authenticate_industry(
        db, int(form_data.username), form_data.password
    )
    if not industry:
        raise HTTPException(
            status_code=401,
            detail="Incorrect industry ID or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(industry.industry_id)},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/dashboard", response_model=Union[List[schemas.Product], List[schemas.Product]])
def dashboard(
    db: Session = Depends(get_db),
    current_industry: int = Depends(get_current_industry),
    product_name: str = None,
    required_quantity: int = 0
):
    industry = operations.get_industry(db, current_industry)
    if not industry:
        raise HTTPException(status_code=404, detail="Industry not found")

    if industry.industry_type in ["Manufacturing Unit", "Recycling Plant"]:
        # Producer: Show registered products
        products = operations.get_products(db, skip=0, limit=100)
        return products
    elif industry.industry_type == "Landfill":
        # Consumer: Search for products by name and required quantity
        if product_name:
            return operations.search_products(
                db=db,
                consumer_lat=industry.latitude,
                consumer_lon=industry.longitude,
                product_name=product_name,
                required_quantity=required_quantity
            )
        else:
            raise HTTPException(status_code=400, detail="Product name is required for searching")
    else:
        raise HTTPException(status_code=400, detail="Invalid industry type")

@app.get("/search_products", response_model=List[schemas.ProductSearchResult])
async def search_products(
    product_name: str = Query(..., description="Name of the product to search for"),
    required_quantity: int = Query(..., description="Minimum quantity required", gt=0),
    db: Session = Depends(get_db),
    current_industry: int = Depends(get_current_industry)
):
    # Get the consumer's industry details
    consumer = operations.get_industry(db, current_industry)
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer industry not found")
    
    # Verify that the requester is a consumer (Landfill)
    if consumer.industry_type != "Landfill":
        raise HTTPException(
            status_code=403, 
            detail="Only consumers (Landfill) can search for products"
        )

    # Search for products
    search_results = operations.search_products(
        db=db,
        consumer_lat=consumer.latitude,
        consumer_lon=consumer.longitude,
        product_name=product_name,
        required_quantity=required_quantity
    )

    if not search_results:
        raise HTTPException(
            status_code=404,
            detail=f"No products found matching '{product_name}' with required quantity {required_quantity}"
        )

    return search_results

@app.get("/get_industries", response_model=List[schemas.Industry])
def read_industries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_industry: int = Depends(get_current_industry)
):
    industries = operations.get_industries(db, skip=skip, limit=limit)
    return industries

@app.post("/register_product", response_model=schemas.Product)
def register_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_industry: int = Depends(get_current_industry)
):
    if current_industry != product.producing_industry_id:
        raise HTTPException(
            status_code=403,
            detail="Can only register products for your own industry"
        )
    return operations.create_product(db=db, product=product)

@app.get("/get_products", response_model=List[schemas.Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_industry: int = Depends(get_current_industry)
):
    products = operations.get_products(db, skip=skip, limit=limit)
    return products

@app.post("/create_transaction", response_model=schemas.Transaction)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_industry: int = Depends(get_current_industry)
):
    if current_industry != transaction.consuming_industry_id:
        raise HTTPException(
            status_code=403,
            detail="Can only create transactions for your own industry"
        )
    return operations.create_transaction(db=db, transaction=transaction)

@app.post("/book_product", response_model=schemas.BookingResponse)
async def book_product(
    booking: schemas.BookingRequest,
    db: Session = Depends(get_db),
    current_industry: int = Depends(get_current_industry)
):
    # Verify that the requester is a consumer (Landfill)
    consumer = operations.get_industry(db, current_industry)
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer industry not found")
    
    if consumer.industry_type != "Landfill":
        raise HTTPException(
            status_code=403,
            detail="Only consumers (Landfill) can book products"
        )

    return operations.book_product(db=db, consumer_id=current_industry, booking=booking)