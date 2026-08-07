from fastapi import APIRouter, Depends, status
from typing import List
from backend.models.product import ProductResponse
from backend.database import get_wishlists_collection
from backend.routers.auth import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[ProductResponse])
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    wish_col = get_wishlists_collection()
    user_wish = await wish_col.find_one({"user_id": str(current_user["_id"])})
    if not user_wish:
        return []
    return user_wish.get("items", [])

@router.post("", response_model=List[ProductResponse])
async def sync_wishlist(items: List[ProductResponse], current_user: dict = Depends(get_current_user)):
    wish_col = get_wishlists_collection()
    user_id = str(current_user["_id"])
    
    # Store or update user's wishlist
    await wish_col.update_one(
        {"user_id": user_id},
        {"$set": {"items": [item.dict() for item in items]}},
        upsert=True
    )
    return items
