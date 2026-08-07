from pydantic import BaseModel, Field
from typing import List, Optional

class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    mrp: float
    discount: int
    rating: float = 4.0
    reviews: int = 0
    stock: int
    brand: str
    image: str
    description: str
    tags: List[str] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    mrp: Optional[float] = None
    discount: Optional[int] = None
    rating: Optional[float] = None
    stock: Optional[int] = None
    brand: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: int
