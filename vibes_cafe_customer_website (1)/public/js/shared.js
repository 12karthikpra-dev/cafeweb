// Vibes Café - Shared Frontend Utilities & Real-Time Components

// Toast Notification Manager
function showToast(message, type = 'success') {
  let container = document.getElementById('vibes-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'vibes-toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-primary text-on-primary' : type === 'error' ? 'bg-error text-on-error' : 'bg-secondary text-on-secondary';
  const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';

  toast.className = `${bgColor} px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto border border-white/10`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[20px]">${icon}</span>
    <span class="font-body-md text-sm font-medium flex-1">${message}</span>
    <button class="text-white/60 hover:text-white transition-colors" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// User Session Utilities
function getAuthToken() {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : localStorage.getItem('vibes_token');
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vibes_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setAuthSession(token, user) {
  if (token) localStorage.setItem('vibes_token', token);
  if (user) localStorage.setItem('vibes_user', JSON.stringify(user));
}

function clearAuthSession() {
  localStorage.removeItem('vibes_token');
  localStorage.removeItem('vibes_user');
  document.cookie = 'token=; Max-Age=0; path=/;';
}

// Cart Manager
const Cart = {
  getItems() {
    try {
      const raw = localStorage.getItem('vibes_cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },
  saveItems(items) {
    localStorage.setItem('vibes_cart', JSON.stringify(items));
    this.updateBadge();
    this.renderDrawer();
  },
  addItem(item) {
    const items = this.getItems();
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        image_url: item.image_url,
        quantity: 1
      });
    }
    this.saveItems(items);
    showToast(`Added "${item.name}" to your order!`, 'success');
    this.openDrawer();
  },
  updateQuantity(id, delta) {
    let items = this.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      items = items.filter(i => i.id !== id);
    }
    this.saveItems(items);
  },
  removeItem(id) {
    let items = this.getItems().filter(i => i.id !== id);
    this.saveItems(items);
  },
  clear() {
    this.saveItems([]);
  },
  getTotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },
  updateBadge() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.vibes-cart-badge');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },
  openDrawer() {
    const drawer = document.getElementById('vibes-cart-drawer');
    const backdrop = document.getElementById('vibes-cart-backdrop');
    if (drawer && backdrop) {
      this.renderDrawer();
      backdrop.classList.remove('hidden');
      requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        drawer.classList.remove('translate-x-full');
      });
    }
  },
  closeDrawer() {
    const drawer = document.getElementById('vibes-cart-drawer');
    const backdrop = document.getElementById('vibes-cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('translate-x-full');
      backdrop.classList.add('opacity-0');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
    }
  },
  renderDrawer() {
    const list = document.getElementById('vibes-cart-items-list');
    const totalEl = document.getElementById('vibes-cart-total-amount');
    const checkoutBtn = document.getElementById('vibes-cart-checkout-btn');
    const emptyEl = document.getElementById('vibes-cart-empty');
    if (!list) return;

    const items = this.getItems();
    const total = this.getTotal();

    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    if (items.length === 0) {
      list.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');
    if (checkoutBtn) checkoutBtn.disabled = false;

    list.innerHTML = items.map(item => `
      <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
        ${item.image_url ? `<img src="${item.image_url}" class="w-14 h-14 rounded-lg object-cover" />` : ''}
        <div class="flex-1 min-w-0">
          <h4 class="font-display font-semibold text-primary text-sm truncate">${item.name}</h4>
          <p class="text-tertiary-container font-label-md text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="flex items-center gap-2 bg-surface rounded-lg p-1 border border-surface-container">
          <button class="w-6 h-6 flex items-center justify-center text-secondary hover:text-primary" onclick="Cart.updateQuantity(${item.id}, -1)">-</button>
          <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
          <button class="w-6 h-6 flex items-center justify-center text-secondary hover:text-primary" onclick="Cart.updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="text-secondary hover:text-error transition-colors p-1" onclick="Cart.removeItem(${item.id})">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `).join('');
  }
};

// Global Reservation Modal Component
function openReservationModal(preferredBranch = '') {
  let modal = document.getElementById('vibes-reservation-modal');
  if (!modal) {
    modal = createReservationModalDOM();
    document.body.appendChild(modal);
  }

  if (preferredBranch) {
    const branchSelect = document.getElementById('res-branch');
    if (branchSelect) branchSelect.value = preferredBranch;
  }

  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
    modal.querySelector('.modal-card').classList.remove('scale-95');
  });
}

function closeReservationModal() {
  const modal = document.getElementById('vibes-reservation-modal');
  if (modal) {
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-card').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
  }
}

function createReservationModalDOM() {
  const overlay = document.createElement('div');
  overlay.id = 'vibes-reservation-modal';
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm transition-opacity duration-300 opacity-0 hidden';

  // Set default minimum date as today
  const today = new Date().toISOString().split('T')[0];

  overlay.innerHTML = `
    <div class="modal-card bg-surface w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-surface-container-high transform transition-transform duration-300 scale-95 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-6 bg-surface-container-low border-b border-surface-container flex justify-between items-center">
        <div>
          <h3 class="font-display text-headline-md font-bold text-primary">Book a Table</h3>
          <p class="font-body-md text-sm text-secondary">Reserve your calm morning or cozy afternoon spot</p>
        </div>
        <button class="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-secondary hover:text-primary transition-colors" onclick="closeReservationModal()">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Form -->
      <form id="vibes-res-form" class="p-6 overflow-y-auto space-y-4 font-body-md text-on-surface">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-label-md text-xs text-secondary mb-1">Select Branch *</label>
            <select id="res-branch" required class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary font-medium">
              <option value="Downtown Roastery">Downtown Roastery</option>
              <option value="Westside Commons">Westside Commons</option>
              <option value="North District">North District</option>
            </select>
          </div>
          <div>
            <label class="block font-label-md text-xs text-secondary mb-1">Guests *</label>
            <select id="res-guests" required class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary font-medium">
              <option value="1">1 Person (Quiet Solo)</option>
              <option value="2" selected>2 People (Table for Two)</option>
              <option value="3">3 People</option>
              <option value="4">4 People</option>
              <option value="6">6 People (Family / Group)</option>
              <option value="8">8+ People (Large Party)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-label-md text-xs text-secondary mb-1">Date *</label>
            <input id="res-date" type="date" value="${today}" min="${today}" required class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary font-medium" />
          </div>
          <div>
            <label class="block font-label-md text-xs text-secondary mb-1">Time Slot *</label>
            <select id="res-time" required class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary font-medium">
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="12:30 PM" selected>12:30 PM (Lunch)</option>
              <option value="1:30 PM">1:30 PM</option>
              <option value="3:00 PM">3:00 PM (Afternoon Tea)</option>
              <option value="5:00 PM">5:00 PM</option>
              <option value="6:30 PM">6:30 PM (Dinner)</option>
              <option value="7:30 PM">7:30 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-label-md text-xs text-secondary mb-1">Seating Area Preference</label>
          <select id="res-table" class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary font-medium">
            <option value="Any Available Table">Any Available Table</option>
            <option value="Window Seat (Bright)">Window Seat (Bright)</option>
            <option value="Patio / Outdoor Garden">Patio / Outdoor Garden</option>
            <option value="Cozy Booth">Cozy Booth</option>
            <option value="Quiet Work Corner">Quiet Work Corner</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-label-md text-xs text-secondary mb-1">Full Name *</label>
            <input id="res-name" type="text" placeholder="Sarah Jenkins" required class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary" />
          </div>
          <div>
            <label class="block font-label-md text-xs text-secondary mb-1">Phone Number *</label>
            <input id="res-phone" type="tel" placeholder="(555) 000-0000" required class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary" />
          </div>
        </div>

        <div>
          <label class="block font-label-md text-xs text-secondary mb-1">Email Address *</label>
          <input id="res-email" type="email" placeholder="sarah@example.com" required class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary" />
        </div>

        <div>
          <label class="block font-label-md text-xs text-secondary mb-1">Special Requests / Notes</label>
          <textarea id="res-notes" rows="2" placeholder="Dietary notes, anniversary celebration, high chair needed, etc." class="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary text-primary resize-none"></textarea>
        </div>

        <div class="pt-2 flex justify-end gap-3">
          <button type="button" onclick="closeReservationModal()" class="px-5 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high text-sm font-label-md transition-colors">Cancel</button>
          <button type="submit" id="res-submit-btn" class="bg-[#ef6e22] hover:bg-[#d85d18] text-white px-6 py-2.5 rounded-lg text-sm font-label-md transition-colors shadow-md flex items-center gap-2">
            <span>Confirm Reservation</span>
            <span class="material-symbols-outlined text-sm">check</span>
          </button>
        </div>
      </form>
    </div>
  `;

  // Handle submit
  overlay.querySelector('#vibes-res-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('res-submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<span>Booking...</span>';

    const payload = {
      branch_name: document.getElementById('res-branch').value,
      guests: document.getElementById('res-guests').value,
      reservation_date: document.getElementById('res-date').value,
      reservation_time: document.getElementById('res-time').value,
      table_info: document.getElementById('res-table').value,
      customer_name: document.getElementById('res-name').value,
      customer_phone: document.getElementById('res-phone').value,
      customer_email: document.getElementById('res-email').value,
      notes: document.getElementById('res-notes').value
    };

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Table reserved successfully! We look forward to welcoming you.', 'success');
        closeReservationModal();
        overlay.querySelector('#vibes-res-form').reset();
      } else {
        showToast(data.error || 'Failed to book reservation.', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Confirm Reservation</span><span class="material-symbols-outlined text-sm">check</span>';
    }
  });

  return overlay;
}

// Global Cart Drawer DOM Injector
function injectCartDrawerDOM() {
  if (document.getElementById('vibes-cart-drawer')) return;

  const container = document.createElement('div');
  container.innerHTML = `
    <!-- Cart Backdrop -->
    <div id="vibes-cart-backdrop" class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 transition-opacity duration-300 opacity-0 hidden" onclick="Cart.closeDrawer()"></div>

    <!-- Cart Drawer -->
    <div id="vibes-cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-full border-l border-surface-container-high">
      <!-- Header -->
      <div class="p-5 bg-surface-container-low border-b border-surface-container flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-tertiary-container">shopping_bag</span>
          <h3 class="font-display text-headline-md font-bold text-primary">Your Order</h3>
        </div>
        <button class="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-secondary hover:text-primary transition-colors" onclick="Cart.closeDrawer()">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Items List -->
      <div class="flex-1 overflow-y-auto p-5">
        <div id="vibes-cart-items-list" class="space-y-3"></div>
        <div id="vibes-cart-empty" class="text-center py-16 space-y-3">
          <span class="material-symbols-outlined text-5xl text-secondary/40">coffee</span>
          <p class="font-display font-semibold text-primary">Your order is empty</p>
          <p class="text-xs text-secondary">Browse our menu and add your favorite artisanal treats.</p>
        </div>
      </div>

      <!-- Order Details & Checkout Form -->
      <div class="p-5 bg-surface-container-low border-t border-surface-container space-y-4">
        <!-- Order Type Selector -->
        <div class="grid grid-cols-2 gap-2 bg-surface p-1 rounded-xl border border-surface-container">
          <button type="button" id="type-dinein" onclick="setOrderType('dine-in')" class="py-2 text-xs font-bold rounded-lg bg-primary text-on-primary transition-colors">Dine-in</button>
          <button type="button" id="type-takeaway" onclick="setOrderType('takeaway')" class="py-2 text-xs font-bold rounded-lg text-secondary hover:text-primary transition-colors">Takeaway</button>
        </div>

        <div id="cart-table-field">
          <label class="block text-xs font-label-md text-secondary mb-1">Table Number</label>
          <input type="text" id="cart-table-num" placeholder="e.g. Table 4" class="w-full bg-surface border-none rounded-lg p-2.5 text-xs text-primary font-medium focus:ring-1 focus:ring-primary" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <input type="text" id="cart-cust-name" placeholder="Your Name *" required class="w-full bg-surface border-none rounded-lg p-2.5 text-xs text-primary font-medium focus:ring-1 focus:ring-primary" />
          <input type="tel" id="cart-cust-phone" placeholder="Phone (optional)" class="w-full bg-surface border-none rounded-lg p-2.5 text-xs text-primary font-medium focus:ring-1 focus:ring-primary" />
        </div>

        <!-- Total -->
        <div class="flex justify-between items-center pt-2 border-t border-surface-container">
          <span class="font-body-md text-secondary text-sm">Estimated Total</span>
          <span id="vibes-cart-total-amount" class="font-display text-headline-md font-bold text-primary">$0.00</span>
        </div>

        <!-- Checkout Button -->
        <button id="vibes-cart-checkout-btn" onclick="submitCartOrder()" class="w-full bg-[#ef6e22] hover:bg-[#d85d18] text-white py-3.5 rounded-xl font-label-md text-sm transition-colors shadow-lg flex items-center justify-center gap-2">
          <span>Place Order</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(container);
}

let currentOrderType = 'dine-in';
function setOrderType(type) {
  currentOrderType = type;
  const dineBtn = document.getElementById('type-dinein');
  const takeBtn = document.getElementById('type-takeaway');
  const tableField = document.getElementById('cart-table-field');

  if (type === 'dine-in') {
    dineBtn.className = 'py-2 text-xs font-bold rounded-lg bg-primary text-on-primary transition-colors';
    takeBtn.className = 'py-2 text-xs font-bold rounded-lg text-secondary hover:text-primary transition-colors';
    if (tableField) tableField.style.display = 'block';
  } else {
    takeBtn.className = 'py-2 text-xs font-bold rounded-lg bg-primary text-on-primary transition-colors';
    dineBtn.className = 'py-2 text-xs font-bold rounded-lg text-secondary hover:text-primary transition-colors';
    if (tableField) tableField.style.display = 'none';
  }
}

async function submitCartOrder() {
  const items = Cart.getItems();
  if (items.length === 0) {
    showToast('Your order is empty.', 'error');
    return;
  }

  const nameInput = document.getElementById('cart-cust-name');
  const customer_name = nameInput ? nameInput.value.trim() : '';
  if (!customer_name) {
    showToast('Please enter your name.', 'error');
    if (nameInput) nameInput.focus();
    return;
  }

  const phoneInput = document.getElementById('cart-cust-phone');
  const tableInput = document.getElementById('cart-table-num');

  const payload = {
    customer_name,
    customer_phone: phoneInput ? phoneInput.value.trim() : '',
    order_type: currentOrderType,
    table_number: currentOrderType === 'dine-in' ? (tableInput ? tableInput.value.trim() : 'Dine-in') : 'Takeaway Counter',
    items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
  };

  const btn = document.getElementById('vibes-cart-checkout-btn');
  btn.disabled = true;
  btn.innerHTML = '<span>Sending Order...</span>';

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`Order #${data.order.order_number} confirmed! Preparing fresh now.`, 'success');
      Cart.clear();
      Cart.closeDrawer();
      if (nameInput) nameInput.value = '';
    } else {
      showToast(data.error || 'Failed to place order.', 'error');
    }
  } catch (err) {
    showToast('Network error. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Place Order</span><span class="material-symbols-outlined text-sm">arrow_forward</span>';
  }
}

// Live SSE Stream Connector
function connectLiveUpdates(onEvent) {
  const eventSource = new EventSource('/api/events');
  eventSource.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data);
      if (onEvent) onEvent(payload);
    } catch (err) {
      console.error('SSE parse error:', err);
    }
  };
  eventSource.onerror = () => {
    // EventSource auto-reconnects
  };
  return eventSource;
}

// Attach global event listeners on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Inject Cart drawer
  injectCartDrawerDOM();
  Cart.updateBadge();

  // Attach Book a Table triggers
  document.querySelectorAll('button, a').forEach(el => {
    const text = el.textContent.trim().toLowerCase();
    if (text === 'book a table' || text.includes('book a table')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openReservationModal();
      });
    }
  });

  // Attach Cart triggers
  document.querySelectorAll('.open-cart-btn, [data-action="open-cart"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      Cart.openDrawer();
    });
  });
});
