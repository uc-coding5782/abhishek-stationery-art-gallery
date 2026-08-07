from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from backend.models.cart import CartItem, CartResponse
from backend.database import get_carts_collection
from backend.routers.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])

@router.get("", response_model=CartResponse)
async def get_cart(current_user: dict = Depends(get_current_user)):
    carts_col = get_carts_collection()
    user_cart = await carts_col.find_one({"user_id": str(current_user["_id"])})
    if not user_cart:
        return CartResponse(items=[])
    return CartResponse(items=user_cart.get("items", []))

@router.post("", response_model=CartResponse)
async def sync_cart(items: List[CartItem], current_user: dict = Depends(get_current_user)):
    carts_col = get_carts_collection()
    user_id = str(current_user["_id"])
    
    # Store or update user's cart
    await carts_col.update_one(
        {"user_id": user_id},
        {"$set": {"items": [item.dict() for item in items]}},
        upsert=True
    )
    return CartResponse(items=items)

@router.delete("")
async def clear_cart(current_user: dict = Depends(get_current_user)):
    carts_col = get_carts_collection()
    user_id = str(current_user["_id"])
    await carts_col.update_one(
        {"user_id": user_id},
        {"$set": {"items": []}}
    )
    return {"message": "Cart cleared successfully"}
