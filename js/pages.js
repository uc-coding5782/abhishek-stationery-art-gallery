// ============================================================
// ABHISHEK BOOK DEPOT — All Pages
// ============================================================
import { fmt, Cart, CartState, Wishlist, WishlistState, Auth, AuthState, Orders, RecentlyViewed, Search, debounce } from './app.js';
import { PRODUCTS, CATEGORIES, BANNERS, OFFERS, TESTIMONIALS, ADMIN_STATS } from './data.js';
import { renderProductCard, renderProductCardList, renderSkeletons, renderSectionHeader, renderOffersStrip } from './components.js';

// ── HOME PAGE ─────────────────────────────────────────────────
export function renderHome() {
  let currentSlide = 0;
  const html = `
    ${renderOffersStrip()}
    ${renderHeroBanner()}
    <div class="container">
      <section class="section fade-in">
        ${renderSectionHeader('Shop by Category', '🏷️')}
        <div class="category-grid" id="category-grid">
          ${CATEGORIES.map(cat => `
            <div class="category-card" onclick="Router.navigate('#/products?cat=${cat.id}')" style="--cat-color:${cat.color}">
              <span class="cat-icon">${cat.icon}</span>
              <span class="cat-name">${cat.name}</span>
            </div>`).join('')}
        </div>
      </section>

      <section class="section">
        ${renderSectionHeader('🔥 Best Sellers', '🔥', '#/products?sort=rating')}
        <div class="products-row" id="bestsellers-row">
          ${PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 10).map(p => renderProductCard(p)).join('')}
        </div>
      </section>

      <section class="section">
        ${renderSectionHeader("Today's Offers", '💥', '#/offers')}
        <div class="products-row" id="offers-row">
          ${PRODUCTS.filter(p => p.discount >= 40).slice(0, 10).map(p => renderProductCard(p)).join('')}
        </div>
      </section>

      <div class="mini-banners">
        <div class="mini-banner" style="background:linear-gradient(135deg,#2874F0,#0052CC)" onclick="Router.navigate('#/products?cat=ncert')">
          <h3>📚 NCERT Books</h3>
          <p>All Classes Available</p>
          <span class="mb-icon">🎓</span>
        </div>
        <div class="mini-banner" style="background:linear-gradient(135deg,#EC4899,#BE185D)" onclick="Router.navigate('#/products?cat=gifts')">
          <h3>🎁 Gift Shop</h3>
          <p>Unique Gifts for Everyone</p>
          <span class="mb-icon">✨</span>
        </div>
        <div class="mini-banner" style="background:linear-gradient(135deg,#F59E0B,#D97706)" onclick="Router.navigate('#/products?cat=toys')">
          <h3>🧸 Toys & Games</h3>
          <p>Up to 43% OFF Today</p>
          <span class="mb-icon">🎮</span>
        </div>
      </div>

      <section class="section">
        ${renderSectionHeader('New Arrivals', '✨', '#/products?sort=new')}
        <div class="products-row" id="new-arrivals-row">
          ${PRODUCTS.slice(60, 72).map(p => renderProductCard(p)).join('')}
        </div>
      </section>

      <section class="section">
        ${renderSectionHeader('🌸 Premium Flower Collection', '🌸', '#/products?cat=flowers')}
        <div class="products-row">
          ${PRODUCTS.filter(p => p.category === 'flowers').map(p => renderProductCard(p)).join('')}
        </div>
      </section>

      <section class="section">
        ${renderSectionHeader('Trending Toys & Games', '🎮', '#/products?cat=toys')}
        <div class="products-row">
          ${PRODUCTS.filter(p => ['toys','games'].includes(p.category)).slice(0,8).map(p => renderProductCard(p)).join('')}
        </div>
      </section>

      <section class="section">
        ${renderSectionHeader('Popular Stationery', '✏️', '#/products?cat=stationery')}
        <div class="products-row">
          ${PRODUCTS.filter(p => ['stationery','pens','art'].includes(p.category)).slice(0,8).map(p => renderProductCard(p)).join('')}
        </div>
      </section>

      <section class="section" id="testimonials-section">
        ${renderSectionHeader('What Our Customers Say', '⭐')}
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
          ${TESTIMONIALS.map(t => `
            <div class="card hover-lift">
              <div class="card-body">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                  <img src="${t.avatar}" alt="${t.name}" style="width:44px;height:44px;border-radius:50%;object-fit:cover" />
                  <div>
                    <div style="font-weight:700;font-size:14px">${t.name}</div>
                    <div style="font-size:11px;color:var(--text-muted)">${t.date}</div>
                  </div>
                </div>
                <div>${fmt.stars(t.rating)}</div>
                <p style="font-size:13px;color:var(--text-secondary);margin-top:8px;line-height:1.6">"${t.text}"</p>
              </div>
            </div>`).join('')}
        </div>
      </section>
    </div>`;
  return html;
}

function renderHeroBanner() {
  const slides = BANNERS.map((b, i) => `
    <div class="hero-slide ${i === 0 ? 'active' : ''}" id="slide-${i}" style="background:${b.gradient}">
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-badge">${b.badge}</span>
          <h1 class="hero-title">${b.title}</h1>
          <p class="hero-subtitle">${b.subtitle}</p>
          <a class="hero-cta" href="#/products?cat=${b.category}" onclick="event.preventDefault();Router.navigate('#/products?cat=${b.category}')">
            ${b.cta} <span class="arrow">→</span>
          </a>
        </div>
        <div class="hero-visual">${['📚','🎓','🎁','🌸','🎮'][i]}</div>
      </div>
    </div>`).join('');
  const dots = BANNERS.map((_, i) => `<span class="hero-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>`).join('');
  return `
    <div class="hero-section">
      <div class="hero-slider" id="hero-slider">
        ${slides}
        <div class="hero-arrows">
          <button class="hero-arrow" onclick="heroSlide(-1)">‹</button>
          <button class="hero-arrow" onclick="heroSlide(1)">›</button>
        </div>
        <div class="hero-dots">${dots}</div>
      </div>
    </div>`;
}

// ── LOGIN PAGE ────────────────────────────────────────────────
export function renderLogin() {
  return `
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-illustration">
        <div class="illus-icon">📚</div>
        <h2>Welcome Back!</h2>
        <p>Sign in to access your orders, wishlist and exclusive offers from Abhishek Stationery & Art Gallery.</p>
        <div class="auth-features">
          <div class="auth-feature"><span class="check">✓</span> 100+ Products</div>
          <div class="auth-feature"><span class="check">✓</span> Easy Returns</div>
          <div class="auth-feature"><span class="check">✓</span> Secure Payments</div>
          <div class="auth-feature"><span class="check">✓</span> Exclusive Offers</div>
        </div>
      </div>
      <div class="auth-form-panel">
        <div class="auth-header">
          <h1>Sign In</h1>
          <p>Enter your credentials to continue</p>
        </div>
        <div id="login-error" style="display:none" class="badge badge-danger" style="margin-bottom:12px;width:100%;padding:10px;border-radius:8px"></div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="form-input-wrap">
            <span class="input-icon">📧</span>
            <input type="email" class="form-input" id="login-email" placeholder="your@email.com" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="form-input-wrap">
            <span class="input-icon">🔒</span>
            <input type="password" class="form-input" id="login-password" placeholder="Enter password" />
            <span class="input-eye" onclick="togglePwd('login-password', this)">👁</span>
          </div>
          <div class="auth-links">
            <span></span>
            <button onclick="" style="color:var(--primary);background:none;border:none;font-size:13px;font-weight:600;cursor:pointer">Forgot Password?</button>
          </div>
        </div>
        <button class="btn btn-primary btn-full btn-lg" id="login-btn" onclick="doLogin()">Sign In</button>
        <div class="auth-divider">OR</div>
        <button class="btn-google" onclick="Toast.show('Google Sign-in coming soon!','info')">
          <svg class="g-icon" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>
        <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-secondary)">
          Don't have an account? <a href="#/signup" onclick="event.preventDefault();Router.navigate('#/signup')" style="color:var(--primary);font-weight:600">Create Account</a>
        </p>
        <p style="text-align:center;margin-top:8px">
          <button onclick="Auth.continueAsGuest();Router.navigate('#/')" style="color:var(--text-muted);background:none;border:none;font-size:13px;cursor:pointer;text-decoration:underline">Continue as Guest</button>
        </p>
        <p style="text-align:center;margin-top:6px;font-size:11px;color:var(--text-muted)">
          Demo: admin@abhishek.com / admin123
        </p>
      </div>
    </div>
  </div>`;
}

// ── SIGNUP PAGE ───────────────────────────────────────────────
export function renderSignup() {
  return `
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-illustration">
        <div class="illus-icon">🎉</div>
        <h2>Join Us Today!</h2>
        <p>Create your account and enjoy exclusive member benefits, order tracking and wishlist features.</p>
        <div class="auth-features">
          <div class="auth-feature"><span class="check">✓</span> Track Your Orders</div>
          <div class="auth-feature"><span class="check">✓</span> Save Your Wishlist</div>
          <div class="auth-feature"><span class="check">✓</span> Member-Only Offers</div>
          <div class="auth-feature"><span class="check">✓</span> Faster Checkout</div>
        </div>
      </div>
      <div class="auth-form-panel" style="overflow-y:auto">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Fill in your details to get started</p>
        </div>
        <div id="signup-error" style="display:none;background:#FEE2E2;color:#B91C1C;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:12px"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <div class="form-input-wrap">
              <span class="input-icon">👤</span>
              <input type="text" class="form-input" id="signup-name" placeholder="Your Name" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Mobile *</label>
            <div class="form-input-wrap">
              <span class="input-icon">📱</span>
              <input type="tel" class="form-input" id="signup-mobile" placeholder="10-digit mobile" maxlength="10" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address *</label>
          <div class="form-input-wrap">
            <span class="input-icon">📧</span>
            <input type="email" class="form-input" id="signup-email" placeholder="your@email.com" />
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Password *</label>
            <div class="form-input-wrap">
              <span class="input-icon">🔒</span>
              <input type="password" class="form-input" id="signup-password" placeholder="Min. 6 characters" />
              <span class="input-eye" onclick="togglePwd('signup-password', this)">👁</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password *</label>
            <div class="form-input-wrap">
              <span class="input-icon">🔒</span>
              <input type="password" class="form-input" id="signup-confirm" placeholder="Repeat password" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Address</label>
          <div class="form-input-wrap">
            <span class="input-icon">📍</span>
            <input type="text" class="form-input" id="signup-address" placeholder="Your full address" />
          </div>
        </div>
        <button class="btn btn-primary btn-full btn-lg" onclick="doSignup()">Create Account</button>
        <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-secondary)">
          Already have an account? <a href="#/login" onclick="event.preventDefault();Router.navigate('#/login')" style="color:var(--primary);font-weight:600">Sign In</a>
        </p>
      </div>
    </div>
  </div>`;
}

// ── PRODUCTS PAGE ─────────────────────────────────────────────
export function renderProducts({ category = 'all', sort = 'default', search = '', minPrice = 0, maxPrice = 2500, rating = 0, page = 1 } = {}) {
  const PER_PAGE = 20;
  let products = [...PRODUCTS];
  if (category && category !== 'all') products = products.filter(p => p.category === category);
  if (search) products = Search.query(search, products);
  if (minPrice > 0) products = products.filter(p => p.price >= minPrice);
  if (maxPrice < 2500) products = products.filter(p => p.price <= maxPrice);
  if (rating > 0) products = products.filter(p => p.rating >= rating);
  if (sort === 'price_asc')  products.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'rating')     products.sort((a, b) => b.rating - a.rating);
  if (sort === 'discount')   products.sort((a, b) => b.discount - a.discount);
  if (sort === 'new')        products = products.slice().reverse();

  const total = products.length;
  const pages = Math.ceil(total / PER_PAGE);
  const paginated = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const catLabel = category && category !== 'all' ? CATEGORIES.find(c => c.id === category)?.name || category : 'All Products';

  const paginationHTML = pages > 1 ? `
    <div style="display:flex;justify-content:center;gap:8px;margin-top:32px;flex-wrap:wrap">
      ${Array.from({length:pages},(_, i)=>`
        <button class="btn ${i+1===page?'btn-primary':'btn-outline'} btn-sm" onclick="goToProductPage(${i+1})">${i+1}</button>`).join('')}
    </div>` : '';

  return `
  <div class="container">
    <div class="products-page" id="products-page">
      <aside class="filter-sidebar" id="filter-sidebar">
        <h3>🔧 Filters <button class="filter-clear" onclick="clearFilters()">Clear All</button></h3>
        <div class="filter-group">
          <h4>Category</h4>
          ${CATEGORIES.map(c => `
            <div class="filter-option">
              <input type="checkbox" id="cat-${c.id}" ${category===c.id?'checked':''} onchange="filterByCategory('${c.id}', this.checked)" />
              <label for="cat-${c.id}">${c.icon} ${c.name}</label>
            </div>`).join('')}
        </div>
        <div class="filter-group">
          <h4>Price Range</h4>
          <div class="price-range">
            <input type="range" min="0" max="2500" value="${maxPrice}" step="50" id="price-range-input" oninput="updatePriceFilter(this.value)" />
            <div class="price-labels"><span>₹0</span><span id="price-range-label">₹${maxPrice}</span></div>
          </div>
        </div>
        <div class="filter-group">
          <h4>Minimum Rating</h4>
          ${[4.5,4.0,3.5,3.0].map(r => `
            <div class="filter-option">
              <input type="radio" name="rating" value="${r}" id="rating-${r}" ${rating===r?'checked':''} onchange="filterByRating(${r})" />
              <label for="rating-${r}">${fmt.stars(r)} & above</label>
            </div>`).join('')}
          <div class="filter-option">
            <input type="radio" name="rating" value="0" id="rating-all" ${!rating?'checked':''} onchange="filterByRating(0)" />
            <label for="rating-all">All Ratings</label>
          </div>
        </div>
        <div class="filter-group">
          <h4>Availability</h4>
          <div class="filter-option">
            <input type="checkbox" id="in-stock" onchange="filterByStock(this.checked)" />
            <label for="in-stock">In Stock Only</label>
          </div>
        </div>
      </aside>
      <main class="products-main">
        <div class="products-toolbar">
          <span class="products-count"><strong>${total}</strong> products in ${catLabel}${search?' for "'+search+'"':''}</span>
          <div style="display:flex;align-items:center;gap:12px">
            <select class="sort-select" id="sort-select" onchange="sortProducts(this.value)">
              <option value="default" ${sort==='default'?'selected':''}>Relevance</option>
              <option value="rating"  ${sort==='rating' ?'selected':''}>Top Rated</option>
              <option value="price_asc" ${sort==='price_asc'?'selected':''}>Price: Low to High</option>
              <option value="price_desc" ${sort==='price_desc'?'selected':''}>Price: High to Low</option>
              <option value="discount" ${sort==='discount'?'selected':''}>Biggest Discount</option>
              <option value="new" ${sort==='new'?'selected':''}>Newest First</option>
            </select>
            <div class="view-toggle">
              <button class="view-btn active" id="grid-view-btn" title="Grid View" onclick="setView('grid')">▦</button>
              <button class="view-btn" id="list-view-btn" title="List View" onclick="setView('list')">☰</button>
            </div>
          </div>
        </div>
        <div class="products-grid" id="products-grid">
          ${paginated.length > 0 ? paginated.map(p => renderProductCard(p)).join('') : `
            <div style="grid-column:1/-1" class="empty-state">
              <div class="empty-icon">🔍</div>
              <div class="empty-title">No Products Found</div>
              <div class="empty-sub">Try adjusting your filters or search term</div>
              <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>`}
        </div>
        ${paginationHTML}
      </main>
    </div>
  </div>`;
}

// ── PRODUCT DETAIL PAGE ───────────────────────────────────────
export function renderProductDetail(id) {
  const product = PRODUCTS.find(p => p.id === parseInt(id));
  if (!product) return `<div class="container"><div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">Product Not Found</div><button class="btn btn-primary" onclick="Router.navigate('#/products')">Browse All Products</button></div></div>`;
  RecentlyViewed.add(product);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);
  const specs = [
    ['Brand', product.brand],
    ['Category', CATEGORIES.find(c => c.id === product.category)?.name || product.category],
    ['Rating', `${product.rating}/5 (${fmt.number(product.reviews)} reviews)`],
    ['Stock', product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'],
    ['Discount', `${product.discount}% off`],
  ];
  const inCart = Cart.has(product.id);
  const inWish = Wishlist.has(product.id);
  const thumbs = [product.image, ...Array.from({length:3},(_,i)=>`https://picsum.photos/seed/${product.id}t${i}/400/400`)];
  return `
  <div class="container">
    <nav class="breadcrumb">
      <a href="#/" onclick="event.preventDefault();Router.navigate('#/')">Home</a> /
      <a href="#/products?cat=${product.category}" onclick="event.preventDefault();Router.navigate('#/products?cat=${product.category}')">${CATEGORIES.find(c=>c.id===product.category)?.name||product.category}</a> /
      <span>${product.name.substring(0,35)}…</span>
    </nav>
    <div class="product-detail-grid">
      <div class="product-gallery">
        <div class="gallery-main">
          <img src="${product.image}" alt="${product.name}" id="gallery-main-img" />
        </div>
        <div class="gallery-thumbs">
          ${thumbs.map((src,i)=>`<div class="gallery-thumb ${i===0?'active':''}" onclick="changeGalleryImg('${src}',this)"><img src="${src}" alt="thumb ${i+1}" /></div>`).join('')}
        </div>
      </div>
      <div class="product-detail-info slide-up">
        <div class="detail-title">${product.name}</div>
        <div class="detail-rating">
          <span class="rating-pill">⭐ ${product.rating}</span>
          <span style="font-size:13px;color:var(--text-secondary)">${fmt.number(product.reviews)} ratings</span>
          <span class="badge badge-success">Bestseller</span>
        </div>
        <div class="detail-price">
          <span class="current">${fmt.price(product.price)}</span>
          <span class="mrp">${fmt.price(product.mrp)}</span>
          <span class="off">${product.discount}% off</span>
          <br/>
          <span class="offer-tag">🏷️ Use code BACK2SCHOOL for extra 20% off</span>
        </div>
        <div class="detail-availability">
          <span class="dot ${product.stock > 0 ? 'dot-green' : 'dot-red'}"></span>
          <span style="font-weight:600">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          ${product.stock > 0 && product.stock < 5 ? `<span class="badge badge-warning">Only ${product.stock} left!</span>` : ''}
        </div>
        <div class="quantity-selector">
          <label>Qty:</label>
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <input class="qty-input" type="number" value="1" min="1" max="10" id="qty-input" readonly />
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
        <div class="detail-action-btns">
          <button class="btn btn-primary ${inCart?'added':''}" id="detail-cart-btn" onclick="addToCartFromDetail(${product.id})" ${product.stock===0?'disabled':''}>
            ${inCart?'✓ Go to Cart':'🛒 Add to Cart'}
          </button>
          <button class="btn btn-secondary" onclick="buyNow(${product.id})">⚡ Buy Now</button>
          <button class="btn ${inWish?'btn-danger':'btn-outline'}" id="detail-wish-btn" onclick="toggleWishlist(${product.id})" title="Wishlist">
            ${inWish?'❤️':'🤍'}
          </button>
        </div>
        <div class="delivery-info">
          <div class="delivery-row">
            <span class="d-icon">🚚</span>
            <div class="d-text"><strong>Free Delivery</strong>On orders above ₹499 | Estimated ${new Date(Date.now()+3*86400000).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}</div>
          </div>
          <div class="delivery-row">
            <span class="d-icon">🔄</span>
            <div class="d-text"><strong>Easy Returns</strong>7-day hassle-free return policy</div>
          </div>
          <div class="delivery-row">
            <span class="d-icon">🔒</span>
            <div class="d-text"><strong>Secure Payment</strong>100% secure payment gateway</div>
          </div>
          <div class="delivery-row">
            <span class="d-icon">🏪</span>
            <div class="d-text"><strong>Store Pickup</strong>Pick up in 2 hours from our store</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:14px">
          <button class="btn btn-ghost btn-sm" onclick="shareProduct(${product.id})">📤 Share</button>
          <span style="font-size:12px;color:var(--text-muted);line-height:1.4;margin-left:auto">Sold by <strong>Abhishek Stationery & Art Gallery</strong><br/>GST included</span>
        </div>
      </div>
    </div>
    <div class="detail-tabs" style="margin-top:40px">
      <div class="tab-header">
        <button class="tab-btn active" onclick="switchTab('description',this)">Description</button>
        <button class="tab-btn" onclick="switchTab('specifications',this)">Specifications</button>
        <button class="tab-btn" onclick="switchTab('reviews',this)">Reviews (${fmt.number(product.reviews)})</button>
      </div>
      <div id="tab-description" class="tab-content">
        <p>${product.description}</p>
        <ul style="margin-top:12px;padding-left:20px;list-style:disc;color:var(--text-secondary);font-size:14px;line-height:2">
          ${product.tags.map(t=>`<li>High quality ${t}</li>`).join('')}
          <li>Trusted brand: ${product.brand}</li>
          <li>Best price guaranteed at Abhishek Stationery & Art Gallery</li>
        </ul>
      </div>
      <div id="tab-specifications" class="tab-content" style="display:none">
        <table class="spec-table">
          ${specs.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
        </table>
      </div>
      <div id="tab-reviews" class="tab-content" style="display:none">
        ${TESTIMONIALS.map(t=>`
          <div style="border-bottom:1px solid var(--border);padding:14px 0">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <img src="${t.avatar}" style="width:36px;height:36px;border-radius:50%;object-fit:cover" />
              <strong style="font-size:14px">${t.name}</strong>
              <span class="rating-pill" style="padding:2px 8px;font-size:12px">⭐ ${t.rating}</span>
              <span style="font-size:11px;color:var(--text-muted);margin-left:auto">${t.date}</span>
            </div>
            <p style="font-size:13px;color:var(--text-secondary)">${t.text}</p>
          </div>`).join('')}
      </div>
    </div>
    ${related.length > 0 ? `
    <section class="section">
      ${renderSectionHeader('Related Products', '🔗')}
      <div class="products-row">
        ${related.map(p => renderProductCard(p)).join('')}
      </div>
    </section>` : ''}
    ${renderRecentlyViewed()}
  </div>`;
}

function renderRecentlyViewed() {
  const items = RecentlyViewed.get().filter(p => p);
  if (items.length < 2) return '';
  return `
  <section class="section">
    ${renderSectionHeader('Recently Viewed', '🕐')}
    <div class="products-row">
      ${items.map(p => renderProductCard(p)).join('')}
    </div>
  </section>`;
}

// ── CART PAGE ─────────────────────────────────────────────────
export function renderCart() {
  const { items } = CartState.get();
  if (items.length === 0) return `
    <div class="container">
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <div class="empty-title">Your Cart is Empty</div>
        <div class="empty-sub">Looks like you haven't added anything yet. Start shopping!</div>
        <button class="btn btn-primary btn-lg" onclick="Router.navigate('#/products')">🛍️ Start Shopping</button>
      </div>
    </div>`;

  const subtotal = Cart.getTotal();
  const mrpTotal = Cart.getMrpTotal();
  const saved = mrpTotal - subtotal;
  const shipping = subtotal >= 499 ? 0 : 49;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + gst;
  const cartItems = items.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" onclick="Router.navigate('#/product/${item.id}')" style="cursor:pointer" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-brand">By ${item.brand}</div>
        <div>
          <span class="cart-item-price">${fmt.price(item.price)}</span>
          <span class="cart-item-mrp">${fmt.price(item.mrp)}</span>
          <span class="cart-item-save">You save ${fmt.price(item.mrp - item.price)} (${item.discount}% off)</span>
        </div>
        <div class="cart-item-actions">
          <div class="cart-qty">
            <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty - 1})">−</button>
            <input class="qty-input" value="${item.qty}" readonly style="width:44px;height:34px" />
            <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
          <button class="cart-remove" onclick="removeFromCart(${item.id})">🗑 Remove</button>
          <button class="btn btn-ghost btn-sm" onclick="moveToWishlist(${item.id})">🤍 Save for Later</button>
        </div>
      </div>
    </div>`).join('');
  return `
  <div class="container">
    <div style="padding:16px 0 8px"><h1 style="font-family:var(--font-display);font-size:22px;font-weight:800">🛒 My Cart <span style="font-size:14px;font-weight:400;color:var(--text-secondary)">(${Cart.getCount()} items)</span></h1></div>
    <div class="cart-page">
      <div class="cart-items">${cartItems}</div>
      <div class="cart-summary">
        <h3>Price Details</h3>
        <div class="coupon-box">
          <label class="form-label" style="font-size:12px;color:var(--text-muted)">Have a coupon?</label>
          <div class="coupon-input-row">
            <input type="text" id="coupon-input" placeholder="Enter coupon code" />
            <button class="btn btn-outline btn-sm copy-btn" onclick="applyCoupon()">Apply</button>
          </div>
          <div id="coupon-msg" style="font-size:12px;margin-top:6px"></div>
        </div>
        <div class="summary-row"><span>Subtotal (${Cart.getCount()} items)</span><span>${fmt.price(subtotal)}</span></div>
        <div class="summary-row"><span>MRP Total</span><span style="text-decoration:line-through;color:var(--text-muted)">${fmt.price(mrpTotal)}</span></div>
        <div class="summary-row"><span style="color:var(--success)">Discount</span><span style="color:var(--success)">−${fmt.price(saved)}</span></div>
        <div id="coupon-discount-row" class="summary-row" style="display:none"><span style="color:var(--success)">Coupon Discount</span><span id="coupon-discount-val" style="color:var(--success)"></span></div>
        <div class="summary-row"><span>Delivery</span><span style="color:${shipping===0?'var(--success)':'var(--text)'}">${shipping === 0 ? 'FREE' : fmt.price(shipping)}</span></div>
        <div class="summary-row"><span>GST (5%)</span><span>${fmt.price(gst)}</span></div>
        <div class="summary-total"><span>Total Amount</span><span id="cart-total-display">${fmt.price(total)}</span></div>
        <div class="summary-save">🎉 You're saving ${fmt.price(saved)} on this order!</div>
        <button class="btn btn-primary btn-full btn-lg" onclick="Router.navigate('#/checkout')">Proceed to Checkout →</button>
        <p style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:10px">🔒 Secure checkout • 7-day easy return</p>
        <div style="margin-top:12px">
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px">Available Coupons:</p>
          ${OFFERS.slice(0,3).map(o=>`<div style="font-size:11px;background:var(--bg);padding:6px 10px;border-radius:6px;margin-bottom:4px;cursor:pointer" onclick="document.getElementById('coupon-input').value='${o.code}'"><strong>${o.code}</strong> — ${o.description}</div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

// ── CHECKOUT PAGE ─────────────────────────────────────────────
export function renderCheckout() {
  const { items } = CartState.get();
  if (items.length === 0) { Router.navigate('#/cart'); return ''; }
  const user = AuthState.get().user;
  const subtotal = Cart.getTotal();
  const shipping = subtotal >= 499 ? 0 : 49;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + gst;
  return `
  <div class="container">
    <div style="padding:16px 0 8px"><h1 style="font-family:var(--font-display);font-size:22px;font-weight:800">Checkout</h1></div>
    <div class="checkout-page">
      <div>
        <div class="checkout-section">
          <div class="checkout-section-header"><span class="step-num">1</span><h3>Delivery Address</h3></div>
          <div class="checkout-section-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div class="form-group"><label class="form-label">Full Name *</label><input class="form-input" id="co-name" value="${user?.name||''}" placeholder="Full Name" /></div>
              <div class="form-group"><label class="form-label">Mobile *</label><input class="form-input" id="co-mobile" value="${user?.mobile||''}" placeholder="10-digit Mobile" /></div>
            </div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="co-email" value="${user?.email||''}" placeholder="email@example.com" /></div>
            <div class="form-group"><label class="form-label">Address *</label><input class="form-input" id="co-address" value="${user?.address||''}" placeholder="House No, Street, Area" /></div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
              <div class="form-group"><label class="form-label">City</label><input class="form-input" id="co-city" placeholder="City" /></div>
              <div class="form-group"><label class="form-label">State</label><input class="form-input" id="co-state" placeholder="State" /></div>
              <div class="form-group"><label class="form-label">Pincode</label><input class="form-input" id="co-pincode" placeholder="6-digit PIN" maxlength="6" /></div>
            </div>
          </div>
        </div>
        <div class="checkout-section">
          <div class="checkout-section-header"><span class="step-num">2</span><h3>Payment Method</h3></div>
          <div class="checkout-section-body">
            <div class="payment-options">
              ${[
                { id:'cod',  icon:'💵', name:'Cash on Delivery', desc:'Pay when your order arrives' },
                { id:'upi',  icon:'📱', name:'UPI',              desc:'Pay with Google Pay, PhonePe, Paytm' },
                { id:'card', icon:'💳', name:'Credit / Debit Card', desc:'All major cards accepted' },
                { id:'nb',   icon:'🏦', name:'Net Banking',      desc:'All major banks supported' },
              ].map((p,i)=>`
                <label class="payment-option ${i===0?'selected':''}" onclick="selectPayment(this,'${p.id}')">
                  <input type="radio" name="payment" value="${p.id}" ${i===0?'checked':''} />
                  <span class="p-icon">${p.icon}</span>
                  <div class="p-info"><div class="p-name">${p.name}</div><div class="p-desc">${p.desc}</div></div>
                </label>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="cart-summary" style="position:sticky;top:80px">
          <h3>Order Summary</h3>
          <div style="max-height:200px;overflow-y:auto;margin-bottom:12px">
            ${items.map(item=>`
              <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--border)">
                <img src="${item.image}" style="width:40px;height:40px;border-radius:6px;object-fit:cover" />
                <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name}</div><div style="font-size:11px;color:var(--text-muted)">Qty: ${item.qty}</div></div>
                <div style="font-size:13px;font-weight:700">${fmt.price(item.price * item.qty)}</div>
              </div>`).join('')}
          </div>
          <div class="summary-row"><span>Subtotal</span><span>${fmt.price(subtotal)}</span></div>
          <div class="summary-row"><span>Delivery</span><span style="color:${shipping===0?'var(--success)':'var(--text)'}">${shipping===0?'FREE':fmt.price(shipping)}</span></div>
          <div class="summary-row"><span>GST (5%)</span><span>${fmt.price(gst)}</span></div>
          <div class="summary-total"><span>Total</span><span>${fmt.price(total)}</span></div>
          <button class="btn btn-primary btn-full btn-lg" style="margin-top:12px" onclick="placeOrder()">🎉 Place Order — ${fmt.price(total)}</button>
          <p style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:8px">🔒 Your data is safe & encrypted</p>
        </div>
      </div>
    </div>
  </div>`;
}

// ── ORDER SUCCESS PAGE ────────────────────────────────────────
export function renderOrderSuccess(orderId) {
  const orders = Orders.getAll();
  const order = orders.find(o => o.id === orderId) || orders[0];
  return `
  <div class="order-success">
    <div class="success-card fade-in">
      <div class="success-animation">🎉</div>
      <div class="success-title">Order Placed Successfully!</div>
      <p class="success-msg">Thank you for shopping with <strong>Abhishek Stationery & Art Gallery</strong>!<br/>Your order has been confirmed and will be delivered by <strong>${order?.estimatedDelivery || 'within 3-5 days'}</strong>.</p>
      <div class="order-number"><span class="confetti-icon">✨</span> Order ID: <strong>${order?.id || orderId}</strong></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
        <button class="btn btn-primary btn-lg" onclick="Router.navigate('#/profile')">Track Order</button>
        <button class="btn btn-outline btn-lg" onclick="Router.navigate('#/')">Continue Shopping</button>
      </div>
      <div style="margin-top:24px;padding:16px;background:var(--bg);border-radius:12px;font-size:13px;color:var(--text-secondary)">
        📧 Order confirmation sent to your email<br/>
        📦 Expected delivery: ${order?.estimatedDelivery || 'within 3-5 days'}<br/>
        📍 From: Abhishek Stationery & Art Gallery, Main Market
      </div>
    </div>
  </div>`;
}

// ── PROFILE PAGE ──────────────────────────────────────────────
export function renderProfile() {
  const { user, isLoggedIn, isGuest } = AuthState.get();
  if (!isLoggedIn && !isGuest) {
    return `<div class="container"><div class="empty-state"><div class="empty-icon">👤</div><div class="empty-title">Please Sign In</div><div class="empty-sub">Sign in to view your profile, orders and wishlist</div><button class="btn btn-primary btn-lg" onclick="Router.navigate('#/login')">Sign In</button></div></div>`;
  }
  const orders = Orders.getAll();
  const initials = user ? user.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'G';
  return `
  <div class="container">
    <div class="profile-page">
      <div class="profile-sidebar">
        <div class="profile-avatar-card">
          <div class="avatar-circle">${initials}</div>
          <div class="profile-name">${user?.name || 'Guest User'}</div>
          <div class="profile-email">${user?.email || 'Not signed in'}</div>
          ${user?.mobile ? `<div style="font-size:12px;color:var(--text-muted);margin-top:4px">📱 ${user.mobile}</div>` : ''}
        </div>
        <nav class="profile-nav">
          <div class="profile-nav-item active" onclick="showProfileTab('orders',this)"><span class="nav-icon">📦</span>My Orders</div>
          <div class="profile-nav-item" onclick="showProfileTab('wishlist',this)"><span class="nav-icon">🤍</span>Wishlist</div>
          <div class="profile-nav-item" onclick="showProfileTab('addresses',this)"><span class="nav-icon">📍</span>Addresses</div>
          <div class="profile-nav-item" onclick="showProfileTab('settings',this)"><span class="nav-icon">⚙️</span>Settings</div>
          <div class="profile-nav-item" onclick="doLogout()" style="color:var(--danger)"><span class="nav-icon">🚪</span>Logout</div>
        </nav>
      </div>
      <div class="profile-content" id="profile-content">
        ${renderProfileOrders(orders)}
      </div>
    </div>
  </div>`;
}

export function renderProfileOrders(orders) {
  if (!orders || orders.length === 0) return `
    <div class="empty-state">
      <div class="empty-icon">📦</div>
      <div class="empty-title">No Orders Yet</div>
      <div class="empty-sub">Start shopping to see your orders here!</div>
      <button class="btn btn-primary" onclick="Router.navigate('#/products')">Shop Now</button>
    </div>`;
  return `
    <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">My Orders (${orders.length})</h3>
    ${orders.map(order => `
      <div class="card hover-lift" style="margin-bottom:12px">
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
            <div>
              <div style="font-weight:700;font-size:15px">Order #${order.id}</div>
              <div style="font-size:12px;color:var(--text-muted)">${fmt.date(order.placedAt)}</div>
            </div>
            <div>
              <span class="badge badge-success">${order.status.toUpperCase()}</span>
            </div>
          </div>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">${order.items?.length || 0} items • Total: <strong>${fmt.price(order.total || 0)}</strong></div>
          <div style="font-size:13px;color:var(--text-muted)">📦 Estimated Delivery: ${order.estimatedDelivery}</div>
          <div style="display:flex;gap:10px;margin-top:12px">
            <button class="btn btn-outline btn-sm">Track Order</button>
            <button class="btn btn-ghost btn-sm">Download Invoice</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--danger)">Return / Refund</button>
          </div>
        </div>
      </div>`).join('')}`;
}

// ── WISHLIST PAGE ─────────────────────────────────────────────
export function renderWishlist() {
  const { items } = WishlistState.get();
  if (items.length === 0) return `
    <div class="container">
      <div class="empty-state">
        <div class="empty-icon">🤍</div>
        <div class="empty-title">Your Wishlist is Empty</div>
        <div class="empty-sub">Save your favourite items here by clicking the ❤️ on any product</div>
        <button class="btn btn-primary btn-lg" onclick="Router.navigate('#/products')">Browse Products</button>
      </div>
    </div>`;
  return `
  <div class="container">
    ${renderSectionHeader(`My Wishlist (${items.length})`, '❤️')}
    <div class="products-grid" style="margin-top:16px">
      ${items.map(p => renderProductCard(p)).join('')}
    </div>
  </div>`;
}

// ── SEARCH RESULTS ────────────────────────────────────────────
export function renderSearch(query) {
  const results = Search.query(query, PRODUCTS);
  return `
  <div class="container">
    <div class="search-page">
      <div class="search-query-display">
        Showing <strong>${results.length}</strong> results for <strong>"${query}"</strong>
      </div>
      ${results.length > 0
        ? `<div class="products-grid">${results.map(p => renderProductCard(p)).join('')}</div>`
        : `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No results found</div><div class="empty-sub">Try searching for something else</div></div>`}
    </div>
  </div>`;
}

// ── OFFERS PAGE ───────────────────────────────────────────────
export function renderOffers() {
  return `
  <div class="container">
    <div class="offers-page">
      <div class="offers-header">
        <h1>🔥 Today's Best Offers</h1>
        <p>Exclusive deals and coupons — save big every day!</p>
      </div>
      <div class="coupons-grid">
        ${OFFERS.map(o => `
          <div class="coupon-card">
            <div class="coupon-icon">${o.category==='books'?'📚':o.category==='school'?'🎒':o.category==='gifts'?'🎁':'🏷️'}</div>
            <div>
              <div class="coupon-code">${o.code}</div>
              <div class="coupon-desc">${o.description}</div>
              <div class="coupon-min">Min. order: ${o.minOrder > 0 ? fmt.price(o.minOrder) : 'No minimum'}</div>
            </div>
            <button class="btn btn-outline btn-sm copy-btn" onclick="copyCoupon('${o.code}')">Copy</button>
          </div>`).join('')}
      </div>
      <section class="section">
        ${renderSectionHeader('Biggest Discounts 💥', '💥')}
        <div class="products-grid">
          ${PRODUCTS.filter(p=>p.discount>=40).slice(0,12).map(p=>renderProductCard(p)).join('')}
        </div>
      </section>
    </div>
  </div>`;
}

// ── CONTACT PAGE ──────────────────────────────────────────────
export function renderContact() {
  return `
  <div class="container">
    <div class="contact-page">
      <div style="text-align:center;padding:32px 0 24px">
        <h1 style="font-family:var(--font-display);font-size:30px;font-weight:900">Get In Touch 📍</h1>
        <p style="color:var(--text-secondary);font-size:15px;margin-top:8px">We're always here to help you find what you need</p>
      </div>
      <div class="contact-grid">
        <div>
          <div class="contact-card">
            <div class="c-icon">📍</div>
            <div>
              <h4>Store Location</h4>
              <p>Main Market, Sector 12<br/>Near Government School<br/>Your City — 110001</p>
            </div>
          </div>
          <div class="contact-card">
            <div class="c-icon">📞</div>
            <div>
              <h4>Phone Numbers</h4>
              <p>+91 98765 43210 (Main Store)<br/>+91 87654 32109 (WhatsApp)<br/>Monday–Saturday: 9AM–8PM</p>
            </div>
          </div>
          <div class="contact-card">
            <div class="c-icon">📧</div>
            <div>
              <h4>Email</h4>
              <p>info@abhishekbooks.com<br/>orders@abhishekbooks.com<br/>We reply within 24 hours</p>
            </div>
          </div>
          <div class="map-placeholder">
            <div class="map-icon">🗺️</div>
            <div style="font-weight:600">Abhishek Stationery & Art Gallery</div>
            <div style="font-size:13px">Main Market, Sector 12</div>
            <button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="Toast.show('Opening Maps…','info')">Open in Google Maps</button>
          </div>
        </div>
        <div>
          <div class="card">
            <div class="card-header"><h3 style="font-size:16px;font-weight:700">Send Us a Message</h3></div>
            <div class="card-body">
              <div class="form-group"><label class="form-label">Your Name</label><input class="form-input" placeholder="Full Name" /></div>
              <div class="form-group"><label class="form-label">Mobile / Email</label><input class="form-input" placeholder="Contact info" /></div>
              <div class="form-group"><label class="form-label">Subject</label>
                <select class="form-input form-select">
                  <option>General Enquiry</option>
                  <option>Book Availability</option>
                  <option>Order Issue</option>
                  <option>Bulk / Wholesale Order</option>
                  <option>Return / Refund</option>
                </select>
              </div>
              <div class="form-group"><label class="form-label">Message</label><textarea class="form-input" rows="4" placeholder="Your message…" style="resize:vertical"></textarea></div>
              <button class="btn btn-primary btn-full" onclick="Toast.show('Message sent! We will reply soon. 📩','success')">Send Message 📩</button>
            </div>
          </div>
          <div class="business-hours" style="margin-top:16px">
            <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">⏰ Business Hours</h4>
            ${[['Monday – Saturday','9:00 AM – 8:00 PM'],['Sunday','10:00 AM – 6:00 PM'],['Public Holidays','10:00 AM – 4:00 PM']].map(([d,t])=>`<div class="hours-row"><span>${d}</span><span style="font-weight:600;color:var(--primary)">${t}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────
export function renderAdmin(subpage = 'dashboard') {
  const navItems = [
    { id:'dashboard',  icon:'📊', label:'Dashboard'  },
    { id:'products',   icon:'📦', label:'Products',  badge: PRODUCTS.length },
    { id:'orders',     icon:'🛍️',  label:'Orders',   badge: ADMIN_STATS.pendingOrders },
    { id:'customers',  icon:'👥', label:'Customers'  },
    { id:'inventory',  icon:'📋', label:'Inventory'  },
    { id:'offers',     icon:'🏷️',  label:'Offers'    },
    { id:'settings',   icon:'⚙️',  label:'Settings'  },
  ];
  const sidebarItems = navItems.map(n => `
    <a class="admin-nav-item ${subpage===n.id?'active':''}" href="#/admin/${n.id}" onclick="event.preventDefault();Router.navigate('#/admin/${n.id}')">
      <span class="a-icon">${n.icon}</span>
      <span>${n.label}</span>
      ${n.badge ? `<span class="a-badge">${n.badge}</span>` : ''}
    </a>`).join('');
  let content = '';
  if (subpage === 'dashboard') content = renderAdminDashboard();
  else if (subpage === 'products') content = renderAdminProducts();
  else if (subpage === 'orders') content = renderAdminOrders();
  else if (subpage === 'customers') content = renderAdminCustomers();
  else if (subpage === 'inventory') content = renderAdminInventory();
  else content = `<div class="card"><div class="card-body"><h3>${navItems.find(n=>n.id===subpage)?.label || subpage} Page</h3><p style="color:var(--text-secondary);margin-top:8px">Coming soon…</p></div></div>`;

  return `
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-logo">
        <div class="logo">🎨 ABD Admin</div>
        <div class="logo-sub">Abhishek Stationery & Art Gallery</div>
      </div>
      <nav class="admin-nav">
        <div class="admin-nav-label">Main Menu</div>
        ${sidebarItems}
      </nav>
      <div style="padding:16px;border-top:1px solid #1E293B">
        <button class="admin-nav-item" onclick="Router.navigate('#/')" style="width:100%">
          <span class="a-icon">🏠</span><span>View Store</span>
        </button>
      </div>
    </aside>
    <main class="admin-content">
      <div class="admin-topbar">
        <h1>${navItems.find(n=>n.id===subpage)?.label || 'Admin Panel'}</h1>
        <div class="topbar-right">
          <button class="btn btn-outline btn-sm" onclick="toggleTheme()">🌙 Theme</button>
          <div style="width:36px;height:36px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700">A</div>
        </div>
      </div>
      ${content}
    </main>
  </div>`;
}

function renderAdminDashboard() {
  const { totalOrders, totalRevenue, totalProducts, totalCustomers, revenueGrowth, ordersGrowth, customersGrowth } = ADMIN_STATS;
  return `
  <div class="stat-grid">
    <div class="stat-card blue"><div class="s-icon">💰</div><div class="s-label">Total Revenue</div><div class="s-value">${fmt.price(totalRevenue)}</div><div class="s-change up">▲ ${revenueGrowth}% this month</div></div>
    <div class="stat-card green"><div class="s-icon">📦</div><div class="s-label">Total Orders</div><div class="s-value">${fmt.number(totalOrders)}</div><div class="s-change up">▲ ${ordersGrowth}% this month</div></div>
    <div class="stat-card yellow"><div class="s-icon">📚</div><div class="s-label">Products</div><div class="s-value">${totalProducts}</div><div class="s-change up">+5 new this week</div></div>
    <div class="stat-card red"><div class="s-icon">👥</div><div class="s-label">Customers</div><div class="s-value">${fmt.number(totalCustomers)}</div><div class="s-change up">▲ ${customersGrowth}% this month</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
    <div class="card">
      <div class="card-header"><h3 style="font-size:14px;font-weight:700">📊 Revenue Overview</h3></div>
      <div class="card-body">
        ${['Jan','Feb','Mar','Apr','May','Jun'].map((m,i)=>{const h=Math.random()*80+20;return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="width:32px;font-size:12px;color:var(--text-muted)">${m}</span><div style="flex:1;height:20px;background:var(--bg);border-radius:4px;overflow:hidden"><div style="width:${h}%;height:100%;background:var(--primary);border-radius:4px;transition:width 1s"></div></div><span style="font-size:12px;font-weight:600;width:60px;text-align:right">${fmt.price(Math.round(h*1500))}</span></div>`;}).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3 style="font-size:14px;font-weight:700">📦 Pending Orders (${ADMIN_STATS.pendingOrders})</h3></div>
      <div class="card-body">
        ${Array.from({length:5},(_,i)=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600">#ORD${1000+i}</div>
              <div style="font-size:11px;color:var(--text-muted)">${['Priya','Rahul','Anjali','Mohit','Sonal'][i]} • ${['Books','Stationery','Toys','Gifts','Pens'][i]}</div>
            </div>
            <span class="badge badge-warning">Pending</span>
            <span style="font-size:13px;font-weight:700">${fmt.price(Math.round(Math.random()*1000+200))}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>
  ${renderAdminRecentProducts()}`;
}

function renderAdminRecentProducts() {
  const recent = PRODUCTS.slice(0, 8);
  return `
  <div class="data-table-wrap">
    <div class="data-table-header">
      <h3>Recent Products</h3>
      <a class="btn btn-primary btn-sm" href="#/admin/products" onclick="event.preventDefault();Router.navigate('#/admin/products')">View All</a>
    </div>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th></tr></thead>
        <tbody>
          ${recent.map(p=>`<tr>
            <td><div style="display:flex;align-items:center;gap:10px"><img class="table-img" src="${p.image}" alt="${p.name}" /><div style="font-size:13px;font-weight:600;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div></div></td>
            <td><span class="badge badge-primary">${p.category}</span></td>
            <td><strong>${fmt.price(p.price)}</strong><br/><span style="font-size:11px;color:var(--text-muted);text-decoration:line-through">${fmt.price(p.mrp)}</span></td>
            <td><span class="${p.stock<5?'badge badge-warning':p.stock===0?'badge badge-danger':'badge badge-success'}">${p.stock} units</span></td>
            <td>⭐ ${p.rating}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderAdminProducts() {
  return `
  <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
    <input class="form-input" style="max-width:280px;flex:1" placeholder="🔍 Search products…" oninput="adminSearchProducts(this.value)" id="admin-search" />
    <button class="btn btn-primary" onclick="showAddProductModal()">+ Add Product</button>
    <select class="form-input form-select" style="max-width:160px" onchange="adminFilterCat(this.value)">
      <option value="">All Categories</option>
      ${CATEGORIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}
    </select>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header"><h3>All Products (${PRODUCTS.length})</h3></div>
    <div style="overflow-x:auto" id="admin-products-table">
      <table class="data-table">
        <thead><tr><th>Product</th><th>Category</th><th>Price / MRP</th><th>Discount</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
        <tbody id="admin-products-tbody">
          ${PRODUCTS.slice(0,20).map(p=>`<tr id="admin-row-${p.id}">
            <td><div style="display:flex;align-items:center;gap:10px"><img class="table-img" src="${p.image}" alt="${p.name}" /><div><div style="font-weight:600;font-size:12px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div><div style="font-size:11px;color:var(--text-muted)">${p.brand}</div></div></div></td>
            <td><span class="badge badge-primary">${p.category}</span></td>
            <td>${fmt.price(p.price)}<br/><span style="font-size:11px;text-decoration:line-through;color:var(--text-muted)">${fmt.price(p.mrp)}</span></td>
            <td><span class="badge badge-danger">${p.discount}%</span></td>
            <td><span class="${p.stock<5?'badge badge-warning':p.stock===0?'badge badge-danger':'badge badge-success'}">${p.stock}</span></td>
            <td>⭐${p.rating}</td>
            <td><div class="action-btns">
              <button class="btn-icon-sm btn-edit" onclick="editProduct(${p.id})" title="Edit">✏️</button>
              <button class="btn-icon-sm btn-del" onclick="deleteProduct(${p.id})" title="Delete">🗑️</button>
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div id="add-product-modal" class="modal-overlay" style="display:none">
    <div class="modal" style="max-width:500px">
      <div class="modal-header"><h3>Add New Product</h3><span class="modal-close" onclick="closeModal('add-product-modal')">×</span></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Product Name</label><input class="form-input" id="ap-name" placeholder="Product Name" /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group"><label class="form-label">Price</label><input class="form-input" id="ap-price" type="number" placeholder="₹" /></div>
          <div class="form-group"><label class="form-label">MRP</label><input class="form-input" id="ap-mrp" type="number" placeholder="₹" /></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group"><label class="form-label">Category</label>
            <select class="form-input form-select" id="ap-category">
              ${CATEGORIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label class="form-label">Brand</label><input class="form-input" id="ap-brand" placeholder="Brand name" /></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group"><label class="form-label">Stock</label><input class="form-input" id="ap-stock" type="number" placeholder="Qty" /></div>
          <div class="form-group"><label class="form-label">Rating</label><input class="form-input" id="ap-rating" type="number" step="0.1" min="1" max="5" placeholder="4.5" /></div>
        </div>
        <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" id="ap-description" rows="3" placeholder="Product description…"></textarea></div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary btn-full" onclick="saveNewProduct()">Save Product</button>
          <button class="btn btn-ghost" onclick="closeModal('add-product-modal')">Cancel</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderAdminOrders() {
  const orders = Orders.getAll();
  const demoOrders = [
    ...orders,
    ...Array.from({length:8-Math.min(orders.length,8)},(_,i)=>({id:`ABD${1000+i}`,items:[{name:'NCERT Math Class 10',qty:1}],total:Math.round(Math.random()*1000+200),status:['confirmed','pending','delivered','shipped'][i%4],placedAt:new Date(Date.now()-i*86400000).toISOString(),estimatedDelivery:'5 Jul 2025'}))
  ].slice(0,10);
  return `
  <div class="data-table-wrap">
    <div class="data-table-header"><h3>Recent Orders</h3><button class="btn btn-outline btn-sm">Export CSV</button></div>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${demoOrders.map((o,i)=>`<tr>
            <td><strong>#${o.id}</strong></td>
            <td>${['Priya S.','Rahul G.','Anjali S.','Mohit V.','Sonal K.','Deepak M.','Neha R.','Arjun T.'][i%8]}</td>
            <td>${o.items?.length||1} items</td>
            <td><strong>${fmt.price(o.total||0)}</strong></td>
            <td><span class="badge ${o.status==='delivered'?'badge-success':o.status==='pending'?'badge-warning':o.status==='shipped'?'badge-primary':'badge-success'}">${o.status?.toUpperCase()}</span></td>
            <td>${fmt.date(o.placedAt)}</td>
            <td><div class="action-btns">
              <button class="btn-icon-sm btn-edit" title="View">👁️</button>
              <button class="btn-icon-sm btn-del" title="Cancel">✕</button>
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderAdminCustomers() {
  const customers = [
    {name:'Priya Sharma',    email:'priya@email.com',  mobile:'9876543210', orders:5,  total:3450, joined:'Jan 2025'},
    {name:'Rahul Gupta',     email:'rahul@email.com',  mobile:'8765432109', orders:12, total:8920, joined:'Feb 2025'},
    {name:'Anjali Singh',    email:'anjali@email.com', mobile:'7654321098', orders:3,  total:1230, joined:'Mar 2025'},
    {name:'Mohit Verma',     email:'mohit@email.com',  mobile:'6543210987', orders:8,  total:5670, joined:'Apr 2025'},
    {name:'Sonal Kapoor',    email:'sonal@email.com',  mobile:'9988776655', orders:15, total:11200,joined:'Jan 2025'},
  ];
  return `
  <div class="data-table-wrap">
    <div class="data-table-header"><h3>All Customers (${customers.length})</h3><input class="form-input" style="max-width:220px" placeholder="Search customers…" /></div>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th>Customer</th><th>Mobile</th><th>Orders</th><th>Total Spend</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          ${customers.map(c=>`<tr>
            <td><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:700">${c.name[0]}</div><div><div style="font-weight:600;font-size:13px">${c.name}</div><div style="font-size:11px;color:var(--text-muted)">${c.email}</div></div></div></td>
            <td>${c.mobile}</td>
            <td><span class="badge badge-primary">${c.orders} orders</span></td>
            <td><strong>${fmt.price(c.total)}</strong></td>
            <td style="color:var(--text-muted);font-size:13px">${c.joined}</td>
            <td><div class="action-btns"><button class="btn-icon-sm btn-edit">👁️</button></div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderAdminInventory() {
  const low = PRODUCTS.filter(p => p.stock < 10);
  return `
  <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat-card green"><div class="s-icon">✅</div><div class="s-label">In Stock</div><div class="s-value">${PRODUCTS.filter(p=>p.stock>10).length}</div></div>
    <div class="stat-card yellow"><div class="s-icon">⚠️</div><div class="s-label">Low Stock (&lt;10)</div><div class="s-value">${low.length}</div></div>
    <div class="stat-card red"><div class="s-icon">❌</div><div class="s-label">Out of Stock</div><div class="s-value">${PRODUCTS.filter(p=>p.stock===0).length}</div></div>
  </div>
  <div class="data-table-wrap">
    <div class="data-table-header"><h3>Low Stock Alerts</h3></div>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Action</th></tr></thead>
        <tbody>
          ${low.map(p=>`<tr>
            <td><div style="display:flex;align-items:center;gap:8px"><img class="table-img" src="${p.image}" alt="${p.name}" /><span style="font-size:13px;font-weight:600">${p.name.substring(0,40)}</span></div></td>
            <td><span class="badge badge-primary">${p.category}</span></td>
            <td><span class="badge ${p.stock===0?'badge-danger':'badge-warning'}">${p.stock} units</span></td>
            <td><button class="btn btn-primary btn-sm" onclick="Toast.show('Restock request sent for ${p.name.substring(0,20)}…','success')">Restock</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}
