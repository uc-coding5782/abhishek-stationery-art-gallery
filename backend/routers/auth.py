from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId
from backend.models.user import UserRegister, UserLogin, UserResponse, UserUpdate, Token
from backend.database import get_users_collection
from backend.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    users_col = get_users_collection()
    user = await users_col.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    users_col = get_users_collection()
    
    # Check if email exists
    existing_user = await users_col.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if first user, make admin, otherwise customer
    count = await users_col.count_documents({})
    role = "admin" if count == 0 else "customer"
    
    # Hash password & create user dictionary
    hashed_pwd = hash_password(user_data.password)
    user_dict = {
        "name": user_data.name,
        "email": user_data.email,
        "mobile": user_data.mobile,
        "password_hash": hashed_pwd,
        "address": user_data.address,
        "role": role
    }
    
    result = await users_col.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Setup response
    user_response = UserResponse(
        id=user_id,
        name=user_dict["name"],
        email=user_dict["email"],
        mobile=user_dict["mobile"],
        address=user_dict["address"],
        role=user_dict["role"]
    )
    
    token = create_access_token(subject=user_id)
    return Token(access_token=token, token_type="bearer", user=user_response)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    users_col = get_users_collection()
    user = await users_col.find_one({"email": credentials.email})
    
    # Validate user credentials
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )
    
    user_id = str(user["_id"])
    user_response = UserResponse(
        id=user_id,
        name=user["name"],
        email=user["email"],
        mobile=user["mobile"],
        address=user.get("address"),
        role=user.get("role", "customer")
    )
    
    token = create_access_token(subject=user_id)
    return Token(access_token=token, token_type="bearer", user=user_response)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        mobile=current_user["mobile"],
        address=current_user.get("address"),
        role=current_user.get("role", "customer")
    )

@router.put("/me", response_model=UserResponse)
async def update_me(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    users_col = get_users_collection()
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if update_dict:
        await users_col.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_dict}
        )
        # Fetch updated user
        updated_user = await users_col.find_one({"_id": current_user["_id"]})
    else:
        updated_user = current_user
        
    return UserResponse(
        id=str(updated_user["_id"]),
        name=updated_user["name"],
        email=updated_user["email"],
        mobile=updated_user["mobile"],
        address=updated_user.get("address"),
        role=updated_user.get("role", "customer")
    )
