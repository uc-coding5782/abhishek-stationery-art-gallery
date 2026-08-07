// ============================================================
// ABHISHEK BOOK DEPOT — App State & Utility Functions
// ============================================================

// ── Storage Helpers ──────────────────────────────────────────
export const Storage = {
  get: (key, def = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch { return def; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

// ── Reactive State ────────────────────────────────────────────
class State {
  constructor(initial) {
    this._state = { ...initial };
    this._listeners = new Set();
  }
  get() { return { ...this._state }; }
  set(patch) {
    this._state = { ...this._state, ...(typeof patch === 'function' ? patch(this._state) : patch) };
    this._listeners.forEach(fn => fn(this._state));
  }
  subscribe(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); }
}

// ── Auth State ────────────────────────────────────────────────
export const AuthState = new State({
  user: Storage.get('abd_user', null),
  isLoggedIn: !!Storage.get('abd_user', null),
  isGuest: Storage.get('abd_guest', false),
});

export const Auth = {
  register(data) {
    const users = Storage.get('abd_users', []);
    if (users.find(u => u.email === data.email)) return { ok: false, error: 'Email already registered' };
    const user = { id: Date.now(), ...data, avatar: null, createdAt: new Date().toISOString(), orders: [] };
    users.push(user);
    Storage.set('abd_users', users);
    Storage.set('abd_user', user);
    Storage.remove('abd_guest');
    AuthState.set({ user, isLoggedIn: true, isGuest: false });
    return { ok: true };
  },
  login(email, password) {
    const users = Storage.get('abd_users', []);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password' };
    Storage.set('abd_user', user);
    Storage.remove('abd_guest');
    AuthState.set({ user, isLoggedIn: true, isGuest: false });
    return { ok: true };
  },
  logout() {
    Storage.remove('abd_user');
    Storage.remove('abd_guest');
    AuthState.set({ user: null, isLoggedIn: false, isGuest: false });
  },
  continueAsGuest() {
    Storage.set('abd_guest', true);
    AuthState.set({ user: null, isLoggedIn: false, isGuest: true });
  },
};

// ── Cart State ────────────────────────────────────────────────
export const CartState = new State({ items: Storage.get('abd_cart', []) });

const saveCart = () => Storage.set('abd_cart', CartState.get().items);

export const Cart = {
  getCount() { return CartState.get().items.reduce((s, i) => s + i.qty, 0); },
  getTotal() { return CartState.get().items.reduce((s, i) => s + i.price * i.qty, 0); },
  getMrpTotal() { return CartState.get().items.reduce((s, i) => s + i.mrp * i.qty, 0); },
  add(product, qty = 1) {
    CartState.set(s => {
      const items = [...s.items];
      const idx = items.findIndex(i => i.id === product.id);
      if (idx >= 0) items[idx] = { ...items[idx], qty: Math.min(items[idx].qty + qty, 10) };
      else items.push({ ...product, qty });
      return { items };
    });
    saveCart();
    Toast.show(`Added to cart!`, 'success');
  },
  remove(id) {
    CartState.set(s => ({ items: s.items.filter(i => i.id !== id) }));
    saveCart();
    Toast.show('Item removed from cart', 'info');
  },
  updateQty(id, qty) {
    if (qty < 1) return Cart.remove(id);
    CartState.set(s => ({ items: s.items.map(i => i.id === id ? { ...i, qty: Math.min(qty, 10) } : i) }));
    saveCart();
  },
  clear() { CartState.set({ items: [] }); saveCart(); },
  has(id) { return CartState.get().items.some(i => i.id === id); },
  applyCoupon(code) {
    const coupons = { BACK2SCHOOL: 20, BOOKFAIR25: 25, FLAT50: 50, FIRSTBUY: 15, GIFT10: 10 };
    const total = Cart.getTotal();
    if (coupons[code.toUpperCase()] !== undefined) {
      const c = coupons[code.toUpperCase()];
      if (typeof c === 'number' && c <= 50 && c > 5) {
        const disc = total * c / 100;
        return { ok: true, discount: Math.round(disc), code: code.toUpperCase(), type: 'percent', rate: c };
      }
    }
    if (code.toUpperCase() === 'FLAT50') return { ok: true, discount: 50, code, type: 'flat' };
    return { ok: false, error: 'Invalid or expired coupon code' };
  }
};

// ── Wishlist State ─────────────────────────────────────────────
export const WishlistState = new State({ items: Storage.get('abd_wishlist', []) });

const saveWishlist = () => Storage.set('abd_wishlist', WishlistState.get().items);

export const Wishlist = {
  has(id) { return WishlistState.get().items.some(i => i.id === id); },
  toggle(product) {
    if (Wishlist.has(product.id)) {
      WishlistState.set(s => ({ items: s.items.filter(i => i.id !== product.id) }));
      saveWishlist();
      Toast.show('Removed from wishlist', 'info');
    } else {
      WishlistState.set(s => ({ items: [...s.items, product] }));
      saveWishlist();
      Toast.show('Added to wishlist! ❤️', 'success');
    }
  },
  getCount() { return WishlistState.get().items.length; },
};

// ── Theme ─────────────────────────────────────────────────────
export const ThemeState = new State({ dark: Storage.get('abd_dark', false) });

export const Theme = {
  toggle() {
    ThemeState.set(s => ({ dark: !s.dark }));
    const dark = ThemeState.get().dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    Storage.set('abd_dark', dark);
  },
  init() {
    const dark = ThemeState.get().dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }
};

// ── Recently Viewed ───────────────────────────────────────────
export const RecentlyViewed = {
  add(product) {
    let items = Storage.get('abd_recent', []);
    items = [product, ...items.filter(i => i.id !== product.id)].slice(0, 8);
    Storage.set('abd_recent', items);
  },
  get() { return Storage.get('abd_recent', []); },
};

// ── Orders ────────────────────────────────────────────────────
export const Orders = {
  place(order) {
    const orders = Storage.get('abd_orders', []);
    const newOrder = {
      id: `ABD${Date.now()}`,
      ...order,
      status: 'confirmed',
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
    };
    orders.unshift(newOrder);
    Storage.set('abd_orders', orders);
    Cart.clear();
    return newOrder;
  },
  getAll() { return Storage.get('abd_orders', []); },
};

// ── Toast Notifications ───────────────────────────────────────
export const Toast = {
  show(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: '💬', warning: '⚠️' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span><span class="toast-msg">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideInRight 0.3s ease reverse'; setTimeout(() => toast.remove(), 300); }, 3000);
  }
};

// ── Utility Functions ──────────────────────────────────────────
export const fmt = {
  price: (n) => `₹${Number(n).toLocaleString('en-IN')}`,
  stars: (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) html += '<span class="star filled">★</span>';
      else if (i === full && half) html += '<span class="star half">★</span>';
      else html += '<span class="star">★</span>';
    }
    return `<span class="stars">${html}</span>`;
  },
  discount: (price, mrp) => Math.round((1 - price / mrp) * 100),
  date: (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  number: (n) => Number(n).toLocaleString('en-IN'),
};

// ── Router ────────────────────────────────────────────────────
export const Router = {
  _routes: {},
  _current: null,
  register(routes) { this._routes = routes; },
  navigate(hash, replace = false) {
    if (replace) history.replaceState(null, '', hash);
    else history.pushState(null, '', hash);
    this._render(hash);
  },
  init() {
    window.addEventListener('popstate', () => this._render(location.hash || '#/'));
    this._render(location.hash || '#/');
  },
  _render(hash) {
    const route = hash.split('?')[0];
    const query = hash.includes('?') ? new URLSearchParams(hash.split('?')[1]) : new URLSearchParams();
    let matched = null;
    let params = {};
    for (const [pattern, handler] of Object.entries(this._routes)) {
      const p = pattern.replace(/:([^/]+)/g, '([^/]+)');
      const keys = [...pattern.matchAll(/:([^/]+)/g)].map(m => m[1]);
      const match = route.match(new RegExp(`^${p}$`));
      if (match) {
        matched = handler;
        keys.forEach((k, i) => { params[k] = match[i + 1]; });
        break;
      }
    }
    if (matched) {
      this._current = route;
      matched({ params, query });
      window.scrollTo(0, 0);
    }
  }
};

// ── Search ────────────────────────────────────────────────────
export const Search = {
  query(q, products) {
    if (!q || q.length < 2) return [];
    q = q.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
};

// ── Debounce ──────────────────────────────────────────────────
export function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Admin Users (for admin login) ─────────────────────────────
export const ADMIN_CREDENTIALS = { email: 'admin@abhishek.com', password: 'admin123' };
