// ============================================================
// ABHISHEK BOOK DEPOT — Main Entry Point
// ============================================================
import {
  Auth, AuthState, Cart, CartState, Wishlist, WishlistState,
  Theme, ThemeState, Router, Toast, Orders, debounce, fmt, Search
} from './app.js';
import { PRODUCTS, CATEGORIES } from './data.js';
import { renderNavbar, renderFooter } from './components.js';
import {
  renderHome, renderLogin, renderSignup, renderProducts, renderProductDetail,
  renderCart, renderCheckout, renderOrderSuccess, renderProfile, renderProfileOrders,
  renderWishlist, renderSearch, renderOffers, renderContact, renderAdmin
} from './pages.js';

// ── Expose globals (used inline in HTML) ─────────────────────
window.Router  = Router;
window.Toast   = Toast;
window.Auth    = Auth;
window.Cart    = Cart;
window.Wishlist= Wishlist;
window.fmt     = fmt;
window.PRODUCTS= PRODUCTS;

// ── State for products page filters ──────────────────────────
let productFilters = { category: 'all', sort: 'default', search: '', minPrice: 0, maxPrice: 2500, rating: 0, page: 1, inStock: false };
let heroSlideIndex = 0;
let heroTimer = null;
let currentView = 'grid';
let adminProducts = [...PRODUCTS];
let appliedCoupon = null;

// ── Global Action Handlers ────────────────────────────────────

window.addToCart = (productId) => {
  const p = PRODUCTS.find(p => p.id === productId);
  if (!p) return;
  Cart.add(p);
  const btn = document.getElementById(`cart-btn-${productId}`);
  if (btn) { btn.textContent = '✓ Added'; btn.classList.add('added'); }
  updateNavBadges();
};

window.toggleWishlist = (productId) => {
  const p = PRODUCTS.find(p => p.id === productId);
  if (!p) return;
  Wishlist.toggle(p);
  const btn = document.getElementById(`wish-btn-${productId}`);
  if (btn) {
    const inWish = Wishlist.has(productId);
    btn.textContent = inWish ? '❤️' : '🤍';
    btn.classList.toggle('active', inWish);
  }
  updateNavBadges();
};

window.removeFromCart = (id) => {
  Cart.remove(id);
  const el = document.getElementById(`cart-item-${id}`);
  if (el) { el.style.animation = 'fadeOut 0.3s ease forwards'; setTimeout(() => renderPage(), 350); }
  else renderPage();
  updateNavBadges();
};

window.updateCartQty = (id, qty) => {
  Cart.updateQty(id, qty);
  renderPage();
  updateNavBadges();
};

window.moveToWishlist = (id) => {
  const p = PRODUCTS.find(p => p.id === id);
  if (p && !Wishlist.has(id)) Wishlist.toggle(p);
  Cart.remove(id);
  renderPage();
  updateNavBadges();
};

window.applyCoupon = () => {
  const code = document.getElementById('coupon-input')?.value?.trim();
  if (!code) { Toast.show('Please enter a coupon code', 'error'); return; }
  const result = Cart.applyCoupon(code);
  const msg = document.getElementById('coupon-msg');
  if (result.ok) {
    appliedCoupon = result;
    if (msg) { msg.style.color = 'var(--success)'; msg.textContent = `✅ Coupon applied! You save ${result.type==='percent'?result.rate+'%':'₹'+result.discount}.`; }
    const row = document.getElementById('coupon-discount-row');
    const val = document.getElementById('coupon-discount-val');
    if (row) row.style.display = 'flex';
    if (val) val.textContent = '−' + fmt.price(result.discount);
    const total = document.getElementById('cart-total-display');
    if (total) {
      const cur = Cart.getTotal() + (Cart.getTotal() >= 499 ? 0 : 49) + Math.round(Cart.getTotal() * 0.05) - result.discount;
      total.textContent = fmt.price(Math.max(cur, 0));
    }
    Toast.show(`Coupon ${code} applied! 🎉`, 'success');
  } else {
    if (msg) { msg.style.color = 'var(--danger)'; msg.textContent = `❌ ${result.error}`; }
    Toast.show(result.error, 'error');
  }
};

window.copyCoupon = (code) => {
  navigator.clipboard?.writeText(code).catch(() => {});
  Toast.show(`Coupon code "${code}" copied! 📋`, 'success');
};

window.placeOrder = () => {
  const name    = document.getElementById('co-name')?.value?.trim();
  const mobile  = document.getElementById('co-mobile')?.value?.trim();
  const address = document.getElementById('co-address')?.value?.trim();
  if (!name || !mobile || !address) { Toast.show('Please fill in all required fields', 'error'); return; }
  if (mobile.length !== 10) { Toast.show('Please enter a valid 10-digit mobile number', 'error'); return; }
  const paymentEl = document.querySelector('input[name="payment"]:checked');
  const payment = paymentEl?.value || 'cod';
  const subtotal = Cart.getTotal();
  const shipping = subtotal >= 499 ? 0 : 49;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + gst - (appliedCoupon?.discount || 0);
  const order = Orders.place({
    items: CartState.get().items,
    total: Math.max(total, 0),
    address: { name, mobile, address, city: document.getElementById('co-city')?.value, state: document.getElementById('co-state')?.value, pincode: document.getElementById('co-pincode')?.value },
    payment,
    coupon: appliedCoupon?.code || null,
  });
  appliedCoupon = null;
  Router.navigate(`#/order-success?id=${order.id}`);
};

window.doLogin = () => {
  const email = document.getElementById('login-email')?.value?.trim();
  const password = document.getElementById('login-password')?.value;
  if (!email || !password) { showAuthError('login-error', 'Please fill in all fields'); return; }
  const result = Auth.login(email, password);
  if (result.ok) {
    Toast.show(`Welcome back! 👋`, 'success');
    Router.navigate('#/');
  } else {
    showAuthError('login-error', result.error);
  }
};

window.doSignup = () => {
  const name    = document.getElementById('signup-name')?.value?.trim();
  const mobile  = document.getElementById('signup-mobile')?.value?.trim();
  const email   = document.getElementById('signup-email')?.value?.trim();
  const password = document.getElementById('signup-password')?.value;
  const confirm = document.getElementById('signup-confirm')?.value;
  const address = document.getElementById('signup-address')?.value?.trim();
  if (!name || !mobile || !email || !password) { showAuthError('signup-error', 'Please fill in all required fields'); return; }
  if (password.length < 6) { showAuthError('signup-error', 'Password must be at least 6 characters'); return; }
  if (password !== confirm) { showAuthError('signup-error', 'Passwords do not match'); return; }
  if (mobile.length !== 10) { showAuthError('signup-error', 'Please enter a valid 10-digit mobile number'); return; }
  const result = Auth.register({ name, mobile, email, password, address });
  if (result.ok) {
    Toast.show(`Account created! Welcome, ${name}! 🎉`, 'success');
    Router.navigate('#/');
  } else {
    showAuthError('signup-error', result.error);
  }
};

window.doLogout = () => {
  Auth.logout();
  Toast.show('Logged out successfully. See you soon! 👋', 'info');
  Router.navigate('#/');
};

window.togglePwd = (inputId, el) => {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  el.textContent = input.type === 'password' ? '👁' : '🙈';
};

window.toggleTheme = () => {
  Theme.toggle();
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = ThemeState.get().dark ? '☀️' : '🌙';
};

// Hero banner controls
window.heroSlide = (dir) => {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  slides[heroSlideIndex].classList.remove('active');
  slides[heroSlideIndex].classList.add('exit');
  setTimeout(() => slides[heroSlideIndex]?.classList.remove('exit'), 600);
  heroSlideIndex = (heroSlideIndex + dir + slides.length) % slides.length;
  slides[heroSlideIndex].classList.add('active');
  updateDots();
};
window.goToSlide = (i) => {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  slides[heroSlideIndex].classList.remove('active');
  heroSlideIndex = i;
  slides[heroSlideIndex].classList.add('active');
  updateDots();
};
function updateDots() {
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === heroSlideIndex));
}
function startHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => heroSlide(1), 4500);
}

// Product page filters
window.filterByCategory = (catId, checked) => {
  productFilters.category = checked ? catId : 'all';
  productFilters.page = 1;
  renderProductsPage();
};
window.clearFilters = () => {
  productFilters = { category: 'all', sort: 'default', search: '', minPrice: 0, maxPrice: 2500, rating: 0, page: 1, inStock: false };
  renderProductsPage();
};
window.sortProducts = (sort) => { productFilters.sort = sort; renderProductsPage(); };
window.goToProductPage = (page) => { productFilters.page = page; renderProductsPage(); window.scrollTo(0, 0); };
window.filterByRating = (r) => { productFilters.rating = r; productFilters.page = 1; renderProductsPage(); };
window.filterByStock  = (v) => { productFilters.inStock = v; productFilters.page = 1; renderProductsPage(); };
window.updatePriceFilter = (v) => {
  productFilters.maxPrice = parseInt(v);
  productFilters.page = 1;
  const label = document.getElementById('price-range-label');
  if (label) label.textContent = `₹${v}`;
  debouncedProductRender();
};
const debouncedProductRender = debounce(renderProductsPage, 300);

window.setView = (view) => {
  currentView = view;
  const grid  = document.getElementById('products-grid');
  const gbtn  = document.getElementById('grid-view-btn');
  const lbtn  = document.getElementById('list-view-btn');
  if (!grid) return;
  if (view === 'list') {
    grid.className = 'products-list';
    gbtn?.classList.remove('active');
    lbtn?.classList.add('active');
    // Re-render in list mode — get filtered products
    let products = [...PRODUCTS];
    if (productFilters.category !== 'all') products = products.filter(p => p.category === productFilters.category);
    grid.innerHTML = products.slice(0, 20).map(p => {
      const { renderProductCardList } = window.__components;
      return renderProductCardList ? renderProductCardList(p) : '';
    }).join('');
  } else {
    grid.className = 'products-grid';
    gbtn?.classList.add('active');
    lbtn?.classList.remove('active');
    renderProductsPage(false);
  }
};

// Product detail actions
window.changeQty = (dir) => {
  const input = document.getElementById('qty-input');
  if (!input) return;
  const val = Math.max(1, Math.min(10, parseInt(input.value) + dir));
  input.value = val;
};
window.addToCartFromDetail = (id) => {
  const p = PRODUCTS.find(p => p.id === id);
  const qty = parseInt(document.getElementById('qty-input')?.value || 1);
  if (!p) return;
  Cart.add(p, qty);
  const btn = document.getElementById('detail-cart-btn');
  if (btn) { btn.textContent = '✓ Go to Cart'; btn.onclick = () => Router.navigate('#/cart'); }
  updateNavBadges();
};
window.buyNow = (id) => {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  Cart.add(p);
  Router.navigate('#/checkout');
  updateNavBadges();
};
window.shareProduct = (id) => {
  const url = `${location.origin}${location.pathname}#/product/${id}`;
  navigator.clipboard?.writeText(url).catch(() => {});
  Toast.show('Product link copied! 📤', 'success');
};
window.changeGalleryImg = (src, thumbEl) => {
  const main = document.getElementById('gallery-main-img');
  if (main) { main.style.opacity = '0'; setTimeout(() => { main.src = src; main.style.opacity = '1'; }, 150); }
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumbEl?.classList.add('active');
};
window.switchTab = (tab, btn) => {
  ['description','specifications','reviews'].forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
};

// Profile
window.showProfileTab = (tab, el) => {
  document.querySelectorAll('.profile-nav-item').forEach(i => i.classList.remove('active'));
  el?.classList.add('active');
  const content = document.getElementById('profile-content');
  if (!content) return;
  if (tab === 'orders') content.innerHTML = renderProfileOrders(Orders.getAll());
  else if (tab === 'wishlist') content.innerHTML = renderWishlistInProfile();
  else if (tab === 'addresses') content.innerHTML = renderAddresses();
  else if (tab === 'settings') content.innerHTML = renderSettings();
};

function renderWishlistInProfile() {
  const { items } = WishlistState.get();
  if (!items.length) return `<div class="empty-state"><div class="empty-icon">🤍</div><div class="empty-title">No Wishlist Items</div></div>`;
  const { renderProductCard: rpc } = window.__components;
  return `<h3 style="font-weight:700;margin-bottom:16px">Wishlist (${items.length})</h3><div class="products-grid">${items.map(p => renderProductCard_inline(p)).join('')}</div>`;
}
function renderProductCard_inline(product) {
  return `<div class="product-card" style="cursor:pointer" onclick="Router.navigate('#/product/${product.id}')">
    <div class="product-img-wrap" style="aspect-ratio:1;background:#f5f7fa">
      <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover" />
      <span class="product-discount-badge">-${product.discount}%</span>
    </div>
    <div class="product-info">
      <div class="product-name">${product.name}</div>
      <div class="product-price-row"><span class="price-current">${fmt.price(product.price)}</span></div>
      <button class="btn-add-cart" onclick="event.stopPropagation();addToCart(${product.id})">🛒 Add to Cart</button>
    </div>
  </div>`;
}
function renderAddresses() {
  const user = AuthState.get().user;
  return `<h3 style="font-weight:700;margin-bottom:16px">Saved Addresses</h3>
    ${user?.address ? `<div class="card"><div class="card-body"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span class="badge badge-primary">Home</span><span class="badge badge-success">Default</span></div><p style="font-size:14px;line-height:1.8">${user.name}<br/>${user.address}<br/>📱 ${user.mobile}</p><div style="display:flex;gap:8px;margin-top:10px"><button class="btn btn-outline btn-sm">Edit</button><button class="btn btn-ghost btn-sm" style="color:var(--danger)">Delete</button></div></div></div>`
    : `<div class="empty-state" style="padding:40px"><div class="empty-icon">📍</div><div class="empty-title">No Addresses Saved</div></div>`}
    <button class="btn btn-primary btn-sm" style="margin-top:12px">+ Add New Address</button>`;
}
function renderSettings() {
  const dark = ThemeState.get().dark;
  return `<h3 style="font-weight:700;margin-bottom:16px">Settings</h3>
    <div class="card"><div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
        <div><div style="font-weight:600">Dark Mode</div><div style="font-size:12px;color:var(--text-muted)">Toggle dark/light theme</div></div>
        <button class="theme-toggle ${dark?'dark':''}" onclick="toggleTheme()"><span class="toggle-knob">${dark?'☀️':'🌙'}</span></button>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
        <div><div style="font-weight:600">Notifications</div><div style="font-size:12px;color:var(--text-muted)">Order updates and offers</div></div>
        <button class="theme-toggle dark"><span class="toggle-knob">🔔</span></button>
      </div>
      <div style="padding:12px 0">
        <button class="btn btn-danger btn-sm" onclick="doLogout()">🚪 Logout</button>
      </div>
    </div></div>`;
}

// Checkout payment selection
window.selectPayment = (el, id) => {
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  el?.classList.add('selected');
};

// Auth helpers
function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = '⚠️ ' + msg; el.style.display = 'block'; }
}

// Admin functions
window.showAddProductModal = () => {
  const modal = document.getElementById('add-product-modal');
  if (modal) modal.style.display = 'flex';
};
window.closeModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
};
window.saveNewProduct = () => {
  const name = document.getElementById('ap-name')?.value?.trim();
  const price = parseFloat(document.getElementById('ap-price')?.value);
  const mrp   = parseFloat(document.getElementById('ap-mrp')?.value);
  if (!name || !price || !mrp) { Toast.show('Please fill in required fields', 'error'); return; }
  const newProduct = {
    id: Date.now(),
    name,
    price,
    mrp,
    discount: Math.round((1 - price/mrp) * 100),
    category: document.getElementById('ap-category')?.value || 'stationery',
    brand: document.getElementById('ap-brand')?.value || 'Generic',
    stock: parseInt(document.getElementById('ap-stock')?.value) || 0,
    rating: parseFloat(document.getElementById('ap-rating')?.value) || 4.0,
    reviews: 0,
    description: document.getElementById('ap-description')?.value || '',
    image: `https://picsum.photos/seed/${Date.now()}/400/400`,
    tags: [],
  };
  PRODUCTS.unshift(newProduct);
  window.PRODUCTS = PRODUCTS;
  closeModal('add-product-modal');
  Toast.show(`Product "${name}" added successfully! ✅`, 'success');
  renderProductsPage();
};
window.editProduct = (id) => { Toast.show(`Edit product #${id} — coming soon!`, 'info'); };
window.deleteProduct = (id) => {
  if (!confirm('Delete this product?')) return;
  const idx = PRODUCTS.findIndex(p => p.id === id);
  if (idx !== -1) PRODUCTS.splice(idx, 1);
  const row = document.getElementById(`admin-row-${id}`);
  if (row) row.remove();
  Toast.show('Product deleted', 'success');
};
window.adminSearchProducts = (q) => {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;
  const filtered = q ? PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())) : PRODUCTS;
  tbody.innerHTML = filtered.slice(0, 20).map(p => `<tr id="admin-row-${p.id}">
    <td><div style="display:flex;align-items:center;gap:10px"><img class="table-img" src="${p.image}" alt="${p.name}" /><span style="font-size:12px;font-weight:600">${p.name.substring(0,35)}</span></div></td>
    <td><span class="badge badge-primary">${p.category}</span></td>
    <td>${fmt.price(p.price)}</td>
    <td><span class="badge badge-danger">${p.discount}%</span></td>
    <td><span class="${p.stock<5?'badge badge-warning':'badge badge-success'}">${p.stock}</span></td>
    <td>⭐${p.rating}</td>
    <td><div class="action-btns"><button class="btn-icon-sm btn-edit" onclick="editProduct(${p.id})">✏️</button><button class="btn-icon-sm btn-del" onclick="deleteProduct(${p.id})">🗑️</button></div></td>
  </tr>`).join('');
};
window.adminFilterCat = (cat) => {
  const filtered = cat ? PRODUCTS.filter(p => p.category === cat) : PRODUCTS;
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;
  tbody.innerHTML = filtered.slice(0, 20).map(p => `<tr id="admin-row-${p.id}">
    <td><div style="display:flex;align-items:center;gap:10px"><img class="table-img" src="${p.image}" alt="${p.name}" /><span style="font-size:12px;font-weight:600">${p.name.substring(0,35)}</span></div></td>
    <td><span class="badge badge-primary">${p.category}</span></td>
    <td>${fmt.price(p.price)}</td>
    <td><span class="badge badge-danger">${p.discount}%</span></td>
    <td><span class="${p.stock<5?'badge badge-warning':'badge badge-success'}">${p.stock}</span></td>
    <td>⭐${p.rating}</td>
    <td><div class="action-btns"><button class="btn-icon-sm btn-edit" onclick="editProduct(${p.id})">✏️</button><button class="btn-icon-sm btn-del" onclick="deleteProduct(${p.id})">🗑️</button></div></td>
  </tr>`).join('');
};

// ── App Shell ─────────────────────────────────────────────────
const app = document.getElementById('app');
const navContainer = document.getElementById('nav-container');
const footerContainer = document.getElementById('footer-container');

function isAdminRoute(hash) { return hash.startsWith('#/admin'); }
function isAuthRoute(hash) { return hash === '#/login' || hash === '#/signup'; }

function renderPage() {
  const hash = location.hash || '#/';
  if (isAdminRoute(hash)) {
    navContainer.innerHTML = '';
    footerContainer.innerHTML = '';
    const sub = hash.replace('#/admin', '').replace('/', '') || 'dashboard';
    app.innerHTML = renderAdmin(sub);
    return;
  }
  // Re-render nav for badge updates
  navContainer.innerHTML = renderNavbar({});
  footerContainer.innerHTML = renderFooter();
  setupSearch();
  updateThemeIcon();
  app.classList.add('fade-in');
  setTimeout(() => app.classList.remove('fade-in'), 400);
}

function renderProductsPage(updateURL = true) {
  const main = document.getElementById('products-main') || document.querySelector('.products-main');
  const fullPage = !main;
  if (fullPage) {
    renderPage();
  } else {
    const pGrid = document.getElementById('products-grid');
    const toolbar = document.querySelector('.products-toolbar .products-count');
    if (pGrid && toolbar) {
      let products = [...PRODUCTS];
      const { category, sort, search, minPrice, maxPrice, rating, inStock, page } = productFilters;
      if (category !== 'all') products = products.filter(p => p.category === category);
      if (search) products = Search.query(search, products);
      if (maxPrice < 2500) products = products.filter(p => p.price <= maxPrice);
      if (rating) products = products.filter(p => p.rating >= rating);
      if (inStock) products = products.filter(p => p.stock > 0);
      if (sort === 'price_asc')  products.sort((a,b) => a.price - b.price);
      if (sort === 'price_desc') products.sort((a,b) => b.price - a.price);
      if (sort === 'rating')     products.sort((a,b) => b.rating - a.rating);
      if (sort === 'discount')   products.sort((a,b) => b.discount - a.discount);
      const PER_PAGE = 20;
      const total = products.length;
      const catLabel = category !== 'all' ? CATEGORIES.find(c=>c.id===category)?.name||category : 'All Products';
      toolbar.innerHTML = `<strong>${total}</strong> products in ${catLabel}`;
      const paginated = products.slice((page-1)*PER_PAGE, page*PER_PAGE);
      const { renderProductCard: rpc } = window.__components || {};
      if (currentView === 'list') {
        pGrid.className = 'products-list';
        import('./components.js').then(m => { pGrid.innerHTML = paginated.map(p => m.renderProductCardList(p)).join('') || '<div class="empty-state" style="grid-column:1/-1">No products found</div>'; });
      } else {
        pGrid.className = 'products-grid';
        import('./components.js').then(m => { pGrid.innerHTML = paginated.map(p => m.renderProductCard(p)).join('') || '<div class="empty-state" style="grid-column:1/-1">No products found</div>'; });
      }
    } else renderPage();
  }
}

// ── Search Setup ─────────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('nav-search-input');
  const suggestions = document.getElementById('search-suggestions');
  const searchBtn = document.getElementById('nav-search-btn');
  if (!input || !suggestions) return;
  const doSearch = () => {
    const q = input.value.trim();
    if (!q) return;
    suggestions.style.display = 'none';
    Router.navigate(`#/search?q=${encodeURIComponent(q)}`);
    input.blur();
  };
  searchBtn?.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); if (e.key === 'Escape') suggestions.style.display = 'none'; });
  const handleInput = debounce((e) => {
    const q = e.target.value.trim();
    if (q.length < 2) { suggestions.style.display = 'none'; return; }
    const results = Search.query(q, PRODUCTS).slice(0, 8);
    if (!results.length) { suggestions.style.display = 'none'; return; }
    suggestions.innerHTML = results.map(p => `
      <div class="search-suggestion-item" onclick="Router.navigate('#/product/${p.id}');document.getElementById('search-suggestions').style.display='none'">
        <img class="s-img" src="${p.image}" alt="${p.name}" loading="lazy" />
        <div>
          <div class="s-name">${p.name.substring(0, 45)}</div>
          <div class="s-price">${fmt.price(p.price)} <span style="text-decoration:line-through;color:var(--text-muted);font-size:11px">${fmt.price(p.mrp)}</span></div>
        </div>
      </div>`).join('') + `<div class="search-suggestion-item" style="justify-content:center;color:var(--primary);font-weight:600" onclick="Router.navigate('#/search?q=${encodeURIComponent(q)}');document.getElementById('search-suggestions').style.display='none'">See all results for "${q}" →</div>`;
    suggestions.style.display = 'block';
  }, 200);
  input.addEventListener('input', handleInput);
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav-search')) suggestions.style.display = 'none'; });
}

function updateNavBadges() {
  const cartBadge = document.getElementById('cart-badge');
  const wishBadge = document.getElementById('wishlist-badge');
  const cc = Cart.getCount();
  const wc = Wishlist.getCount();
  if (cartBadge) { cartBadge.textContent = cc; cartBadge.style.display = cc > 0 ? 'flex' : 'none'; }
  if (wishBadge) { wishBadge.textContent = wc; wishBadge.style.display = wc > 0 ? 'flex' : 'none'; }
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = ThemeState.get().dark ? '☀️' : '🌙';
}

// ── Router Setup ─────────────────────────────────────────────
Router.register({
  '#/': () => {
    renderPage();
    app.innerHTML = renderHome();
    heroSlideIndex = 0;
    startHeroTimer();
  },
  '#/login': () => {
    renderPage();
    app.innerHTML = renderLogin();
  },
  '#/signup': () => {
    renderPage();
    app.innerHTML = renderSignup();
  },
  '#/products': () => {
    const qs = new URLSearchParams(location.hash.includes('?') ? location.hash.split('?')[1] : '');
    productFilters.category = qs.get('cat') || 'all';
    productFilters.sort     = qs.get('sort') || 'default';
    productFilters.search   = qs.get('q') || '';
    productFilters.page     = 1;
    renderPage();
    app.innerHTML = renderProducts(productFilters);
  },
  '#/product/:id': ({ params }) => {
    renderPage();
    app.innerHTML = renderProductDetail(params.id);
  },
  '#/cart': () => {
    renderPage();
    app.innerHTML = renderCart();
  },
  '#/checkout': () => {
    renderPage();
    app.innerHTML = renderCheckout();
  },
  '#/order-success': () => {
    const qs = new URLSearchParams(location.hash.includes('?') ? location.hash.split('?')[1] : '');
    renderPage();
    app.innerHTML = renderOrderSuccess(qs.get('id'));
  },
  '#/profile': () => {
    renderPage();
    app.innerHTML = renderProfile();
  },
  '#/wishlist': () => {
    renderPage();
    app.innerHTML = renderWishlist();
  },
  '#/search': () => {
    const qs = new URLSearchParams(location.hash.includes('?') ? location.hash.split('?')[1] : '');
    renderPage();
    app.innerHTML = renderSearch(qs.get('q') || '');
  },
  '#/offers': () => {
    renderPage();
    app.innerHTML = renderOffers();
  },
  '#/contact': () => {
    renderPage();
    app.innerHTML = renderContact();
  },
  '#/admin': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('dashboard');
  },
  '#/admin/dashboard': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('dashboard');
  },
  '#/admin/products': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('products');
  },
  '#/admin/orders': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('orders');
  },
  '#/admin/customers': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('customers');
  },
  '#/admin/inventory': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('inventory');
  },
  '#/admin/offers': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('offers');
  },
  '#/admin/settings': () => {
    navContainer.innerHTML = ''; footerContainer.innerHTML = '';
    app.innerHTML = renderAdmin('settings');
  },
});

// ── Subscribe to state changes ────────────────────────────────
CartState.subscribe(() => updateNavBadges());
WishlistState.subscribe(() => updateNavBadges());

// ── Init ─────────────────────────────────────────────────────
Theme.init();
document.getElementById('page-loader')?.classList.add('hidden');
Router.init();
