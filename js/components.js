// ============================================================
// ABHISHEK BOOK DEPOT — UI Components
// ============================================================
import { fmt, Cart, Wishlist, WishlistState, CartState, Router } from './app.js';

// ── Navbar ────────────────────────────────────────────────────
export function renderNavbar({ onSearch, onSearchInput }) {
  const cartCount = Cart.getCount();
  const wishCount = Wishlist.getCount();
  const cats = [
    { id: 'all',        name: 'All',          icon: '🏪' },
    { id: 'ncert',      name: 'NCERT',        icon: '🎓' },
    { id: 'books',      name: 'Books',        icon: '📚' },
    { id: 'stationery', name: 'Stationery',   icon: '✏️' },
    { id: 'pens',       name: 'Pens',         icon: '🖊️' },
    { id: 'copies',     name: 'Copies',       icon: '📓' },
    { id: 'art',        name: 'Art & Craft',  icon: '🎨' },
    { id: 'toys',       name: 'Toys',         icon: '🧸' },
    { id: 'games',      name: 'Games',        icon: '🎮' },
    { id: 'gifts',      name: 'Gifts',        icon: '🎁' },
    { id: 'flowers',    name: 'Flowers',      icon: '🌸' },
    { id: 'offers',     name: 'Offers🔥',     icon: '' },
  ];
  const catLinks = cats.map(c => `
    <a class="nav-cat-item" href="#/products?cat=${c.id}" onclick="event.preventDefault();Router.navigate('#/products?cat=${c.id}')" data-cat="${c.id}">
      ${c.icon} ${c.name}
    </a>`).join('');
  return `
  <nav class="navbar" id="main-navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="#/" onclick="event.preventDefault();Router.navigate('#/')">
        <span class="logo-icon">🎨</span>
        <div>
          <div class="logo-text">ABHISHEK</div>
          <div class="logo-sub">STATIONERY & ART GALLERY</div>
        </div>
      </a>
      <div class="nav-search">
        <div class="search-wrap">
          <input type="text" id="nav-search-input" placeholder="Search books, stationery, toys, gifts…" autocomplete="off" />
          <button class="search-btn" id="nav-search-btn" title="Search">🔍</button>
        </div>
        <div class="search-suggestions" id="search-suggestions" style="display:none"></div>
      </div>
      <div class="nav-actions">
        <button class="nav-btn" onclick="toggleTheme()" title="Toggle Dark Mode" id="theme-btn">
          <span class="btn-icon" id="theme-icon">🌙</span>
          <span class="btn-label">Theme</span>
        </button>
        <a class="nav-btn" href="#/wishlist" onclick="event.preventDefault();Router.navigate('#/wishlist')" title="Wishlist">
          <span class="btn-icon">🤍</span>
          <span class="btn-label">Wishlist</span>
          <span class="nav-badge" id="wishlist-badge" style="${wishCount > 0 ? '' : 'display:none'}">${wishCount}</span>
        </a>
        <a class="nav-btn" href="#/cart" onclick="event.preventDefault();Router.navigate('#/cart')" title="Cart">
          <span class="btn-icon">🛒</span>
          <span class="btn-label">Cart</span>
          <span class="nav-badge" id="cart-badge" style="${cartCount > 0 ? '' : 'display:none'}">${cartCount}</span>
        </a>
        <a class="nav-btn" href="#/profile" onclick="event.preventDefault();Router.navigate('#/profile')" title="Profile">
          <span class="btn-icon">👤</span>
          <span class="btn-label">Profile</span>
        </a>
      </div>
    </div>
    <div class="nav-categories">
      <div class="container">${catLinks}</div>
    </div>
  </nav>`;
}

// ── Footer ────────────────────────────────────────────────────
export function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="f-logo">🎨 ABHISHEK STATIONERY & ART GALLERY</div>
          <p class="f-desc">Your one-stop destination for stationery, art materials, books, gifts, flowers, toys and everything in between. Serving the community with love since 2005.</p>
          <div class="social-links">
            <a class="social-btn" href="#" title="Facebook">📘</a>
            <a class="social-btn" href="#" title="Instagram">📸</a>
            <a class="social-btn" href="#" title="WhatsApp">💬</a>
            <a class="social-btn" href="#" title="YouTube">▶️</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#/" onclick="event.preventDefault();Router.navigate('#/')">Home</a></li>
            <li><a href="#/products" onclick="event.preventDefault();Router.navigate('#/products')">All Products</a></li>
            <li><a href="#/offers" onclick="event.preventDefault();Router.navigate('#/offers')">Today's Offers</a></li>
            <li><a href="#/contact" onclick="event.preventDefault();Router.navigate('#/contact')">Contact Us</a></li>
            <li><a href="#/admin" onclick="event.preventDefault();Router.navigate('#/admin')">Admin Panel</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="#/products?cat=ncert" onclick="event.preventDefault();Router.navigate('#/products?cat=ncert')">NCERT Books</a></li>
            <li><a href="#/products?cat=stationery" onclick="event.preventDefault();Router.navigate('#/products?cat=stationery')">Stationery</a></li>
            <li><a href="#/products?cat=toys" onclick="event.preventDefault();Router.navigate('#/products?cat=toys')">Toys & Games</a></li>
            <li><a href="#/products?cat=gifts" onclick="event.preventDefault();Router.navigate('#/products?cat=gifts')">Gifts</a></li>
            <li><a href="#/products?cat=flowers" onclick="event.preventDefault();Router.navigate('#/products?cat=flowers')">Flowers</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="#">📍 Main Market, Sector 12</a></li>
            <li><a href="#">📞 +91 98765 43210</a></li>
            <li><a href="#">📧 info@abhishekstationery.com</a></li>
            <li><a href="#/contact" onclick="event.preventDefault();Router.navigate('#/contact')">Store Timings</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Abhishek Stationery & Art Gallery. Made with ❤️ for our community.</span>
        <div class="footer-badges">
          <span class="footer-badge">Secure Payments</span>
          <span class="footer-badge">Easy Returns</span>
          <span class="footer-badge">Fast Delivery</span>
        </div>
      </div>
    </div>
  </footer>`;
}

// ── Product Card ──────────────────────────────────────────────
export function renderProductCard(product, small = false) {
  const inWish = Wishlist.has(product.id);
  const inCart = Cart.has(product.id);
  const stockBadge = product.stock < 5 ? `<span class="product-stock-low">Only ${product.stock} left!</span>` :
                     product.stock === 0 ? `<span class="product-stock-out">Out of Stock</span>` : '';
  return `
  <div class="product-card ${small ? 'small' : ''}" data-product-id="${product.id}" onclick="Router.navigate('#/product/${product.id}')">
    <div class="product-img-wrap">
      <span class="product-discount-badge">-${product.discount}%</span>
      <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://picsum.photos/seed/${product.id}default/400/400'" />
      <button class="product-wishlist-btn ${inWish ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist(${product.id})" id="wish-btn-${product.id}">
        ${inWish ? '❤️' : '🤍'}
      </button>
      <div class="product-quick-view">👁 Quick View</div>
    </div>
    <div class="product-info">
      <div class="product-brand">${product.brand}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-rating">
        ${fmt.stars(product.rating)}
        <span class="rating-count">(${fmt.number(product.reviews)})</span>
      </div>
      <div class="product-price-row">
        <span class="price-current">${fmt.price(product.price)}</span>
        <span class="price-mrp">${fmt.price(product.mrp)}</span>
        <span class="price-off">${product.discount}% off</span>
      </div>
      ${stockBadge}
      <div class="product-actions">
        <button class="btn-add-cart ${inCart ? 'added' : ''}" id="cart-btn-${product.id}" onclick="event.stopPropagation();addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
          ${inCart ? '✓ Added' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  </div>`;
}

// ── Product Card List View ────────────────────────────────────
export function renderProductCardList(product) {
  const inWish = Wishlist.has(product.id);
  const inCart = Cart.has(product.id);
  return `
  <div class="product-card-list" onclick="Router.navigate('#/product/${product.id}')">
    <div class="product-img-wrap">
      <span class="product-discount-badge">-${product.discount}%</span>
      <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy" />
    </div>
    <div class="product-info">
      <div class="product-brand">${product.brand}</div>
      <div class="product-name" style="font-size:15px;-webkit-line-clamp:1">${product.name}</div>
      <div class="product-rating">
        ${fmt.stars(product.rating)}
        <span class="rating-count">(${fmt.number(product.reviews)} reviews)</span>
      </div>
      <div class="product-desc">${product.description}</div>
      <div class="product-price-row">
        <span class="price-current">${fmt.price(product.price)}</span>
        <span class="price-mrp">${fmt.price(product.mrp)}</span>
        <span class="price-off">${product.discount}% off</span>
      </div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-primary btn-sm ${inCart ? 'added' : ''}" onclick="event.stopPropagation();addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
          ${inCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
        </button>
        <button class="btn btn-outline btn-sm ${inWish ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist(${product.id})">
          ${inWish ? '❤️ Wishlisted' : '🤍 Wishlist'}
        </button>
      </div>
    </div>
  </div>`;
}

// ── Skeleton Cards ────────────────────────────────────────────
export function renderSkeletons(count = 5) {
  return Array.from({length: count}, () => `
    <div class="skeleton-card product-card">
      <div class="skeleton skeleton-img"></div>
      <div style="padding:12px">
        <div class="skeleton skeleton-line" style="width:40%;height:10px;margin:4px 0"></div>
        <div class="skeleton skeleton-line" style="height:14px;margin:6px 0"></div>
        <div class="skeleton skeleton-line short" style="height:10px"></div>
        <div class="skeleton skeleton-line" style="width:60%;height:20px;margin:8px 0"></div>
        <div class="skeleton skeleton-line" style="height:34px;border-radius:8px;margin-top:10px"></div>
      </div>
    </div>`).join('');
}

// ── Section Header ────────────────────────────────────────────
export function renderSectionHeader(title, icon, viewAllHref = null) {
  return `
  <div class="section-header">
    <div>
      <h2 class="section-title"><span class="title-icon">${icon}</span>${title}</h2>
      <div class="section-accent"></div>
    </div>
    ${viewAllHref ? `<a class="section-view-all" href="${viewAllHref}" onclick="event.preventDefault();Router.navigate('${viewAllHref}')">View All →</a>` : ''}
  </div>`;
}

// ── Offers Strip ──────────────────────────────────────────────
export function renderOffersStrip() {
  const items = [
    '🎒 Back to School Sale — 20% OFF',
    '📚 NCERT Books — All Classes In Stock',
    '🎁 New Gift Collection Arrived',
    '🖊️ Buy 2 Get 1 FREE on Pens',
    '🌸 Fresh Flower Bouquets Available',
    '🎮 Toys Up to 43% OFF',
    '📦 Free Delivery on Orders Above ₹499',
    '🎨 Art & Craft Kits Starting ₹49',
  ];
  const repeated = [...items, ...items].map(t => `<span class="offers-strip-item">•&nbsp;&nbsp;${t}</span>`).join('');
  return `<div class="offers-strip"><div class="offers-strip-inner">${repeated}</div></div>`;
}

// ── Star Rating Input ─────────────────────────────────────────
export function renderStarRating(rating, size = 14) {
  return fmt.stars(rating);
}

// ── Page Header ────────────────────────────────────────────────
export function renderPageHeader(title, subtitle = '') {
  return `
  <div style="padding:24px 0 12px">
    <h1 style="font-family:var(--font-display);font-size:26px;font-weight:800;color:var(--text)">${title}</h1>
    ${subtitle ? `<p style="color:var(--text-secondary);font-size:14px;margin-top:4px">${subtitle}</p>` : ''}
  </div>`;
}
