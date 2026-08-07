from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from backend.database import (
    get_orders_collection, 
    get_products_collection, 
    get_users_collection
)
from backend.routers.auth import get_current_admin
from backend.models.order import OrderResponse
from backend.models.user import UserResponse

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(admin: dict = Depends(get_current_admin)) -> Dict[str, Any]:
    orders_col = get_orders_collection()
    products_col = get_products_collection()
    users_col = get_users_collection()
    
    # 1. Total Orders count
    total_orders = await orders_col.count_documents({})
    
    # 2. Total Products count
    total_products = await products_col.count_documents({})
    
    # 3. Total Customers count
    total_customers = await users_col.count_documents({"role": "customer"})
    
    # 4. Total Revenue (sum of order totals)
    pipeline = [
        {"$match": {"status": {"$ne": "cancelled"}}},
        {"$group": {"_id": None, "total_revenue": {"$sum": "$total"}}}
    ]
    cursor = orders_col.aggregate(pipeline)
    revenue_result = await cursor.to_list(length=1)
    total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0.0
    
    # 5. Pending orders (where status is "confirmed" or "pending")
    pending_orders = await orders_col.count_documents({"status": {"$in": ["confirmed", "pending"]}})
    
    return {
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "totalProducts": total_products,
        "totalCustomers": total_customers,
        "pendingOrders": pending_orders,
        "revenueGrowth": 18.5,
        "ordersGrowth": 12.3,
        "customersGrowth": 8.7
    }

@router.get("/orders", response_model=List[OrderResponse])
async def list_all_orders(admin: dict = Depends(get_current_admin)):
    orders_col = get_orders_collection()
    cursor = orders_col.find({}).sort("placedAt", -1)
    orders = []
    async for order in cursor:
        orders.append(OrderResponse(**order))
    return orders

@router.get("/customers", response_model=List[UserResponse])
async def list_all_customers(admin: dict = Depends(get_current_admin)):
    users_col = get_users_collection()
    cursor = users_col.find({"role": "customer"})
    customers = []
    async for user in cursor:
        customers.append(UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            mobile=user["mobile"],
            address=user.get("address"),
            role=user.get("role", "customer")
        ))
    return customers
