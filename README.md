<div align="center">

# 📚 ABHISHEK STATIONERY & ART GALLERY
### *The Modern Digital Sanctuary of Literature, Fine Art & Precision Supplies*

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/ES6+_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

---

**[Explore Store](#-architectural-overview) • [API Documentation](#-api-blueprint-matrix) • [Client Mechanics](#-frontend-reactive-state-engine) • [Quick Start](#-quick-start-guide)**

</div>

---

## 🌟 Executive Summary

**Abhishek Stationery & Art Gallery** (famously known as *Abhishek Book Depot*) is an enterprise-grade, full-stack E-Commerce platform tailored for art supplies, academic textbooks, office equipment, luxury pens, and handcrafted gifts. 

Engineered with a **zero-dependency, native ES6+ vanilla frontend** connected to a high-performance **asynchronous Python FastAPI & Motor MongoDB backend**, the application delivers sub-millisecond dynamic client rendering, seamless dark/light theme switching, interactive administrative controls, and resilient hybrid offline/online catalog persistence.

---

## 🎨 System Architecture Blueprint

The platform employs a hybrid architecture designed for maximal uptime, zero render delay, and seamless client-server data synchronization.

```mermaid
flowchart TB
    subgraph ClientLayer ["🖥️ Client Workspace (Browser Runtime)"]
        direction TB
        UI["🎨 Glassmorphic Interface\n(HTML5 / CSS Custom Properties)"]
        Router["⚡ Client-Side Hash Router\n(#/products, #/product/:id, #/admin)"]
        StateEngine["🔄 Reactive Observer State Engine\n(AuthState, CartState, WishlistState, ThemeState)"]
        LocalStore["💾 LocalStorage Persistence Engine\n(abd_cart, abd_user, abd_wishlist)"]
        
        UI <--> Router
        Router <--> StateEngine
        StateEngine <--> LocalStore
    end

    subgraph TransportLayer ["🌐 Transport & Security Layer"]
        HTTP["📡 REST APIs (HTTP / JSON)"]
        JWTAuth["🔐 Bearer JWT Authentication"]
        CORS["🛡️ Universal CORS Middleware"]
    end

    subgraph BackendLayer ["🐍 Asynchronous Server Core (FastAPI)"]
        FastAPI["🚀 FastAPI Application (uvicorn)"]
        
        subgraph Routers ["API Routers"]
            rAuth["/api/v1/auth"]
            rProd["/api/v1/products"]
            rCart["/api/v1/cart"]
            rWish["/api/v1/wishlist"]
            rOrd["/api/v1/orders"]
            rAdmin["/api/v1/admin"]
        end
        
        SecModule["🔑 BCrypt Password Hashing & JWT Signer"]
        SeedEngine["🌱 Auto-Catalog Seeding Engine"]
        
        FastAPI --> Routers
        FastAPI --> SecModule
        FastAPI --> SeedEngine
    end

    subgraph DataLayer ["🗄️ Persistence Layer (MongoDB)"]
        MotorClient["⚡ AsyncIOMotorClient Driver"]
        MongoDB[("🍃 MongoDB Database\n(abhishek_book_depot)")]
        
        subgraph Collections ["Database Collections"]
            cUsers[("users")]
            cProducts[("products")]
            cOrders[("orders")]
            cCarts[("carts")]
            cWishlists[("wishlists")]
        end
        
        MotorClient <--> MongoDB
        MongoDB --- Collections
    end

    StateEngine -.->|Async Fetch / REST Sync| HTTP
    HTTP <--> CORS
    CORS <--> JWTAuth
    JWTAuth <--> FastAPI
    Routers <--> MotorClient
```

---

## ⚡ Client-Side Reactive State Engine

Instead of pulling in heavy frontend framework bundles, the app utilizes an in-house **Observer-Pattern Reactive State Engine** implemented in [`js/app.js`](file:///c:/Users/Admin/Desktop/coding/antigrav/abhishek-book-depot/js/app.js).

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Customer
    participant Card as 🛍️ Product Component
    participant CartState as 🛒 Cart Reactive State
    participant Storage as 💾 Browser LocalStorage
    participant Toast as 💬 Toast Notification Engine
    participant Nav as 🔔 Navigation Badges

    User->>Card: Clicks "Add to Cart"
    Card->>CartState: Cart.add(product, qty)
    activate CartState
    CartState->>CartState: Mutate state items array
    CartState->>Storage: Storage.set('abd_cart', updatedItems)
    CartState-->>Toast: Toast.show("Added to cart!", "success")
    CartState-->>Nav: Broadcast state subscriber update
    deactivate CartState
    Nav->>Nav: Re-render Cart Counter Badge (e.g. 3 -> 4)
    Toast->>User: Display animated glassmorphic toast
```

---

## 🛒 Checkout & Order Processing Pipeline

```mermaid
flowchart LR
    A["🛒 Customer Cart"] --> B{"🎟️ Apply Coupon Code?"}
    B -- Yes --> C["Apply Rules (BACK2SCHOOL / FLAT50 / etc.)"]
    B -- No --> D["Standard Subtotal Calculation"]
    C --> E["Calculate Tax (5% GST) & Shipping Fee"]
    D --> E
    E --> F["Form Validation (Shipping Details & Payment Method)"]
    F --> G["Dispatch Order Creation Payload"]
    G --> H["Persist in DB / Local Storage"]
    H --> I["Clear Active Cart & Redirect to #/order-success"]
```

---

## 🍃 MongoDB Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o| CARTS : owns
    USERS ||--o| WISHLISTS : maintains
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : referenced_in

    USERS {
        string id PK
        string name
        string email
        string mobile
        string hashed_password
        string role "customer | admin"
        string address
        date createdAt
    }

    PRODUCTS {
        int id PK
        string name
        string category
        float price
        float mrp
        int discount
        float rating
        int reviews
        int stock
        string brand
        string image
        string description
        array tags
    }

    ORDERS {
        string id PK
        string user_id FK
        array items
        float total
        object address
        string payment
        string coupon
        string status "confirmed | processing | shipped | delivered"
        string placedAt
        string estimatedDelivery
    }

    CARTS {
        string user_id FK
        array items
    }

    WISHLISTS {
        string user_id FK
        array items
    }
```

---

## 🔥 Key Architectural Features

### 1. 🚀 Native ES6 Single Page Application (SPA)
* **Zero Build Step:** Uses pure native ES6 ECMAScript modules (`import`/`export`) running directly in any modern web browser without Webpack, Vite, or Babel overhead.
* **Hash-Based Router:** Custom router support with dynamic route parameter extraction (`#/product/:id`, `#/search?q=query`, `#/admin/*`).
* **Micro-Animations & Aesthetics:** Powered by custom CSS variables, glassmorphism, responsive grid containers, and smooth UI transitions.

### 2. ⚡ High-Performance Asynchronous Python FastAPI Engine
* **Non-Blocking I/O:** Leverages Python `async`/`await` primitives with `uvicorn` and `AsyncIOMotorClient`.
* **Auto Database Seeding:** Intelligent startup hook (`lifespan`) automatically populates standard product catalogs if MongoDB is empty.
* **Role-Based JWT Security:** Secure access tokens using `python-jose` with `bcrypt` password hashing.

### 3. 🔍 Smart Instant Search & Live Filters
* **Debounced Execution:** Client-side search input is debounced (200ms delay) to prevent UI thread thrashing.
* **Multi-Attribute Matching:** Matches product queries against title, brand, category, and descriptive tags.
* **Granular Filters:** Interactive price range sliders, star rating toggles, category selectors, and multi-tier sorting (price ascending/descending, top rated, highest discount).

### 4. 🎟️ Intelligent Coupon & Discount Engine
* **Dynamic Coupons:** Support for percentage discounts (`BACK2SCHOOL` for 20%, `BOOKFAIR25` for 25%) and flat discounts (`FLAT50`).
* **Real-time Price Engine:** Calculates MRP savings, GST charges, free shipping thresholds (₹499+), and total cart summaries on the fly.

### 5. 👑 Comprehensive Admin Control Center
* **Live Catalog Management:** Add, edit, filter, and delete inventory items.
* **Metrics & Analytics:** Real-time summary cards for total revenue, active orders, product counts, and low-stock alerts.
* **Category Filters:** Filter administrative inventory by stationery, art supplies, luxury pens, and books.

---

## 📁 Repository Directory Structure

```
abhishek-book-depot/
├── 📄 index.html              # Main HTML5 entry point & application shell
├── 📄 manifest.json            # PWA manifest specification & standalone app icon configuration
├── 📄 .gitignore               # Ignored temporary runtime files & Python caches
├── 📂 css/
│   └── 🎨 style.css           # Complete design system (CSS variables, dark mode, animations)
├── 📂 js/
│   ├── ⚡ app.js               # Reactive State classes, Auth, Cart, Wishlist, Storage & Router
│   ├── 📦 components.js        # Reusable UI component renderers (Navbar, Footer, Product Cards)
│   ├── 🗃️ data.js              # Fallback product catalog & category definitions
│   ├── 🚀 main.js              # Application entry point, global event handlers & routes
│   └── 📑 pages.js             # Page-level template renders (Home, Products, Admin, Detail)
├── 📂 backend/
│   ├── ⚙️ main.py              # FastAPI application server entry point & lifespan manager
│   ├── 🗄️ database.py          # Motor AsyncIOMotorClient MongoDB connection factory
│   ├── 🔒 security.py          # Password hashing, verification, & JWT token signer
│   ├── 🌱 seed_data.py          # Catalog seed data generator for MongoDB startup initialization
│   ├── 📋 requirements.txt     # Python backend dependencies (FastAPI, uvicorn, motor, pymongo)
│   ├── 📂 models/              # Pydantic data validation schemas
│   │   ├── 📄 product.py
│   │   ├── 📄 user.py
│   │   ├── 📄 order.py
│   │   └── 📄 cart.py
│   └── 📂 routers/             # Asynchronous API endpoints
│       ├── 🌐 auth.py
│       ├── 🌐 products.py
│       ├── 🌐 cart.py
│       ├── 🌐 wishlist.py
│       ├── 🌐 orders.py
│       └── 🌐 admin.py
└── 📂 assets/                  # Product imagery & static media assets
```

---

## 📡 API Blueprint Matrix

| Module | Endpoint | Method | Auth | Description |
| :--- | :--- | :---: | :---: | :--- |
| **System** | `/` | `GET` | ❌ | Health check and server status |
| **Auth** | `/api/v1/auth/register` | `POST` | ❌ | Register new customer account |
| **Auth** | `/api/v1/auth/login` | `POST` | ❌ | Authenticate credentials & generate JWT |
| **Auth** | `/api/v1/auth/me` | `GET` | 🔒 | Get current authenticated user details |
| **Products** | `/api/v1/products` | `GET` | ❌ | List products with search, cat, & price filters |
| **Products** | `/api/v1/products/{id}` | `GET` | ❌ | Fetch detailed product metadata |
| **Products** | `/api/v1/products` | `POST` | 🔑 Admin | Add new product to catalog |
| **Products** | `/api/v1/products/{id}` | `DELETE`| 🔑 Admin | Delete product from catalog |
| **Cart** | `/api/v1/cart` | `GET` | 🔒 | Retrieve user cart items |
| **Cart** | `/api/v1/cart/add` | `POST` | 🔒 | Add product item to cart |
| **Orders** | `/api/v1/orders` | `POST` | 🔒 | Create and place a new purchase order |
| **Orders** | `/api/v1/orders` | `GET` | 🔒 | List user order history |
| **Admin** | `/api/v1/admin/stats` | `GET` | 🔑 Admin | Retrieve store analytics dashboard stats |

---

## 🛠️ Quick Start Guide

### Prerequisites
- **Node.js / Live Server** (Optional for local static server execution)
- **Python 3.10+** (Required for FastAPI backend)
- **MongoDB** (Optional local instance or MongoDB Atlas URI)

---

### Option 1: Standalone Client Mode (Immediate Run)

Because the client application is designed with an offline-first fallback engine, you can launch the store interface directly without setting up a backend!

1. **Open [`index.html`](file:///c:/Users/Admin/Desktop/coding/antigrav/abhishek-book-depot/index.html)** in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Alternatively, serve using a static web server:
   ```bash
   npx serve .
   ```
3. Navigate to `http://localhost:3000` in your browser.

---

### Option 2: Full-Stack Mode (FastAPI + MongoDB Engine)

To enable persistent server database synchronization and live API authentication:

#### 1. Configure Python Backend Dependencies
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### 2. Configure Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=abhishek_book_depot
JWT_SECRET=supersecretjwtkeyforabhishekbookdepot2026
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
PORT=8000
HOST=127.0.0.1
```

#### 3. Launch FastAPI Development Server
```bash
python main.py
```
The server will start at `http://127.0.0.1:8000`. Automatic OpenAPI documentation is available at:
* **Interactive Swagger UI:** `http://127.0.0.1:8000/docs`
* **Redoc UI:** `http://127.0.0.1:8000/redoc`

---

## 🎯 Default Admin Credentials

To access the interactive **Admin Control Center** at `#/admin`:
* **Email:** `admin@abhishek.com`
* **Password:** `admin123`

---

## 📄 License & Credits

Designed & Crafted with ❤️ for **Abhishek Stationery & Art Gallery**.
Licensed under the [MIT License](LICENSE).
