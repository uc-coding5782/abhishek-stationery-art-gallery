from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from backend.models.product import ProductCreate, ProductUpdate, ProductResponse
from backend.database import get_products_collection
from backend.routers.auth import get_current_admin

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = "all",
    sort: Optional[str] = "default",
    search: Optional[str] = "",
    maxPrice: Optional[float] = 2500.0,
    rating: Optional[float] = 0.0,
    page: Optional[int] = 1,
    limit: Optional[int] = 100
):
    products_col = get_products_collection()
    
    # Construct filter query
    query = {}
    if category and category != "all":
        query["category"] = category
    
    if search:
        # Search match by regex on name, brand, description, tags
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
        
    if maxPrice < 2500.0:
        query["price"] = {"$lte": maxPrice}
        
    if rating > 0.0:
        query["rating"] = {"$gte": rating}
        
    cursor = products_col.find(query)
    
    # Apply Sorting
    if sort == "price_asc":
        cursor = cursor.sort("price", 1)
    elif sort == "price_desc":
        cursor = cursor.sort("price", -1)
    elif sort == "rating":
        cursor = cursor.sort("rating", -1)
    elif sort == "discount":
        cursor = cursor.sort("discount", -1)
    elif sort == "new":
        cursor = cursor.sort("id", -1) # newest by sequential integer id
        
    # Pagination
    skip = (page - 1) * limit
    cursor = cursor.skip(skip).limit(limit)
    
    products = []
    async for p in cursor:
        products.append(ProductResponse(**p))
        
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    products_col = get_products_collection()
    product = await products_col.find_one({"id": product_id})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return ProductResponse(**product)

@router.post("", response_model=ProductResponse)
async def add_product(product_data: ProductCreate, admin: dict = Depends(get_current_admin)):
    products_col = get_products_collection()
    
    # Auto-generate next integer ID by querying maximum id
    max_id_doc = await products_col.find_one(sort=[("id", -1)])
    next_id = (max_id_doc["id"] + 1) if max_id_doc else 1
    
    product_dict = product_data.dict()
    product_dict["id"] = next_id
    
    await products_col.insert_one(product_dict)
    return ProductResponse(**product_dict)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int, 
    product_data: ProductUpdate, 
    admin: dict = Depends(get_current_admin)
):
    products_col = get_products_collection()
    update_dict = {k: v for k, v in product_data.dict().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update fields provided"
        )
        
    result = await products_col.update_one(
        {"id": product_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    updated = await products_col.find_one({"id": product_id})
    return ProductResponse(**updated)

@router.delete("/{product_id}")
async def delete_product(product_id: int, admin: dict = Depends(get_current_admin)):
    products_col = get_products_collection()
    result = await products_col.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return {"message": "Product deleted successfully"}
