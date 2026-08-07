import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load env variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "abhishek_book_depot")

client = None
db = None

def get_database():
    global client, db
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[DB_NAME]
    return db

async def close_database():
    global client
    if client is not None:
        client.close()
        client = None

# Helpers to get collections
def get_users_collection():
    return get_database()["users"]

def get_products_collection():
    return get_database()["products"]

def get_orders_collection():
    return get_database()["orders"]

def get_carts_collection():
    return get_database()["carts"]

def get_wishlists_collection():
    return get_database()["wishlists"]
