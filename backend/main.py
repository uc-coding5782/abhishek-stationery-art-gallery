import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.database import (
    get_database, 
    close_database, 
    get_products_collection
)
from backend.seed_data import get_seed_products
from backend.routers import auth, products, cart, wishlist, orders, admin

# Load settings
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup connection
    db = get_database()
    print("Successfully connected to MongoDB.")
    
    # Auto-seed database if empty
    products_col = get_products_collection()
    count = await products_col.count_documents({})
    if count == 0:
        print("Database is empty. Seeding standard products catalog...")
        seed_items = get_seed_products()
        await products_col.insert_many(seed_items)
        print(f"Successfully seeded {len(seed_items)} products in MongoDB.")
        
    yield
    
    # Shutdown connection
    await close_database()
    print("Database connection closed gracefully.")

app = FastAPI(
    title="Abhishek Book Depot - API Backend",
    description="Python FastAPI & MongoDB Backend REST APIs",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware config to allow any client connection (including local file:// protocol)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(wishlist.router)
app.include_router(orders.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to Abhishek Book Depot API Server!",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
