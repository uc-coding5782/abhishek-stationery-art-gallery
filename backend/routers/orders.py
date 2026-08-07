from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
from backend.models.order import OrderCreate, OrderResponse
from backend.database import get_orders_collection, get_users_collection, get_carts_collection
from backend.routers.auth import security, decode_access_token

router = APIRouter(prefix="/api/orders", tags=["Orders"])

async def get_current_user_optional(credentials: Optional[object] = Depends(security)) -> Optional[dict]:
    if not credentials:
        return None
    try:
        token = credentials.credentials
        user_id = decode_access_token(token)
        if not user_id:
            return None
        users_col = get_users_collection()
        return await users_col.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None

@router.post("", response_model=OrderResponse)
async def place_order(order_data: OrderCreate, current_user: Optional[dict] = Depends(get_current_user_optional)):
    orders_col = get_orders_collection()
    
    # Generate ID
    order_id = f"ABD{int(datetime.utcnow().timestamp())}"
    
    # Calculate estimated delivery
    est_date = datetime.utcnow() + timedelta(days=3)
    est_delivery_str = est_date.strftime("%d %b %Y")
    
    order_dict = order_data.dict()
    order_dict["id"] = order_id
    order_dict["placedAt"] = datetime.utcnow().isoformat()
    order_dict["estimatedDelivery"] = est_delivery_str
    order_dict["status"] = "confirmed"
    
    if current_user:
        user_id_str = str(current_user["_id"])
        order_dict["user_id"] = user_id_str
        
        # Clear cart database
        carts_col = get_carts_collection()
        await carts_col.update_one({"user_id": user_id_str}, {"$set": {"items": []}})
    else:
        order_dict["user_id"] = "guest"
        
    await orders_col.insert_one(order_dict)
    return OrderResponse(**order_dict)

@router.get("", response_model=List[OrderResponse])
async def get_my_orders(current_user: dict = Depends(get_current_user_optional)):
    orders_col = get_orders_collection()
    
    if not current_user:
        # If guest, they won't have saved orders or need to provide guest order verification.
        # But we'll return empty list by default.
        return []
        
    cursor = orders_col.find({"user_id": str(current_user["_id"])}).sort("placedAt", -1)
    orders = []
    async for order in cursor:
        orders.append(OrderResponse(**order))
    return orders
