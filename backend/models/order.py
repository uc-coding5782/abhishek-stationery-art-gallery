from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    id: int
    name: str
    price: float
    mrp: float
    discount: int
    brand: str
    image: str
    qty: int

class AddressInfo(BaseModel):
    name: str
    mobile: str
    address: str
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total: float
    address: AddressInfo
    payment: str = "cod"
    coupon: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    items: List[OrderItem]
    total: float
    address: AddressInfo
    payment: str
    coupon: Optional[str] = None
    status: str = "confirmed"
    placedAt: str
    estimatedDelivery: str
