from pydantic import BaseModel, Field
from typing import List, Optional

class CartItem(BaseModel):
    id: int
    name: str
    price: float
    mrp: float
    discount: int
    brand: str
    image: str
    qty: int

class CartUpdateItem(BaseModel):
    qty: int

class CartResponse(BaseModel):
    items: List[CartItem] = []
