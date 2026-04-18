const API_BASE_URL = window.getNujoomApiBaseUrl ? window.getNujoomApiBaseUrl() : '/api';

let token = localStorage.getItem('adminToken');
let adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
let menuItemsCache = [];
let galleryImagesCache = [];

function checkAuth() {
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  if (adminUser) {
    const adminNameEl = document.getElementById('admin-name');
    if (adminNameEl) adminNameEl.textContent = adminUser.name || adminUser.email;
  }
  return true;
}

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  initNavigation();
  initAnimations();
  loadDashboardStats();
  loadMenuItems();
  loadReservations();
  loadGalleryImages();
  loadReviews();
});

function initAnimations() {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    }, 200 + index * 150);
  });
}

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = document.querySelectorAll('.admin-section');
  const pageTitle = document.getElementById('page-title');

  navItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 100 + index * 50);
    
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = item.dataset.section;

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      const titles = {
        dashboard: 'Dashboard',
        menu: 'Menu Management',
        reservations: 'Reservations',
        gallery: 'Gallery',
        reviews: 'Reviews'
      };
      if (pageTitle) pageTitle.textContent = titles[sectionId] || 'Dashboard';
    });
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.classList.toggle('active');
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  const addMenuBtn = document.getElementById('add-menu-btn');
  if (addMenuBtn) {
    addMenuBtn.addEventListener('click', () => openMenuModal());
  }

  const addGalleryBtn = document.getElementById('add-gallery-btn');
  if (addGalleryBtn) {
    addGalleryBtn.addEventListener('click', () => openGalleryModal());
  }

  const modalClose = document.getElementById('modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }

  const filterBtn = document.getElementById('filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', loadReservations);
  }
}

async function loadDashboardStats() {
  try {
    const response = await fetch(API_BASE_URL + '/reservations/stats', {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch stats');

    const data = await response.json();

    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statToday = document.getElementById('stat-today');
    const statMonth = document.getElementById('stat-month');

    if (statTotal) statTotal.textContent = data.totalCount || 0;
    if (statPending) statPending.textContent = data.pendingCount || 0;
    if (statToday) statToday.textContent = data.todayCount || 0;
    if (statMonth) statMonth.textContent = data.thisMonth || 0;

    renderRecentReservations(data.recentReservations || []);
  } catch (error) {
    console.error('Error loading stats:', error);
    showToast('Failed to load dashboard stats', true);
  }
}

function renderRecentReservations(reservations) {
  const tbody = document.getElementById('recent-tbody');
  if (!tbody) return;

  if (!reservations || reservations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">No recent reservations</td></tr>';
    return;
  }

  tbody.innerHTML = reservations.map(res => `
    <tr>
      <td>${escapeHtml(res.name)}</td>
      <td>${escapeHtml(res.phone)}</td>
      <td>${formatDate(res.date)}</td>
      <td>${formatTime(res.time)}</td>
      <td>${res.guests}</td>
      <td><span class="status-badge ${res.status}">${res.status}</span></td>
    </tr>
  `).join('');
}

async function loadMenuItems() {
  try {
    const response = await fetch(API_BASE_URL + '/menu');
    if (!response.ok) throw new Error('Failed to fetch menu');

    menuItemsCache = await response.json();
    renderMenuItems(menuItemsCache);
  } catch (error) {
    console.error('Error loading menu:', error);
    showToast('Failed to load menu items', true);
  }
}

function renderMenuItems(items) {
  const tbody = document.getElementById('menu-tbody');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="loading-cell">No menu items found</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td><img src="${item.image || 'https://via.placeholder.com/50'}" alt="${escapeHtml(item.name)}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" onerror="this.src='https://via.placeholder.com/50'"></td>
      <td><strong>${escapeHtml(item.name)}</strong></td>
      <td style="text-transform:capitalize;">${(item.category || '').replace('-', ' ')}</td>
      <td>Rs.${item.price}</td>
      <td style="text-transform:capitalize;">${item.spiceLevel || 'medium'}</td>
      <td>${item.isFeatured ? '<span class="status-badge active">Yes</span>' : '<span class="status-badge inactive">No</span>'}</td>
      <td>${item.isAvailable ? '<span class="status-badge available">Available</span>' : '<span class="status-badge unavailable">Unavailable</span>'}</td>
      <td>
        <div class="actions">
          <button class="edit-btn" onclick="openMenuModal('${item._id}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" onclick="deleteMenuItem('${item._id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function loadReservations() {
  const statusEl = document.getElementById('status-filter');
  const dateEl = document.getElementById('date-filter');
  const status = statusEl ? statusEl.value : '';
  const date = dateEl ? dateEl.value : '';

  try {
    let url = API_BASE_URL + '/reservations?';
    if (status) url += 'status=' + status + '&';
    if (date) url += 'date=' + date + '&';

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch reservations');

    const data = await response.json();
    reservationsCache = data.reservations || [];
    renderReservations(reservationsCache);
  } catch (error) {
    console.error('Error loading reservations:', error);
    showToast('Failed to load reservations', true);
  }
}

function renderReservations(reservations) {
  const tbody = document.getElementById('reservations-tbody');
  if (!tbody) return;

  if (!reservations || reservations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="loading-cell">No reservations found</td></tr>';
    return;
  }

  tbody.innerHTML = reservations.map(res => `
    <tr data-id="${res._id}">
      <td><strong>${escapeHtml(res.name)}</strong></td>
      <td>
        <span class="phone-cell">${escapeHtml(res.phone)}</span>
      </td>
      <td>${res.email ? escapeHtml(res.email) : '-'}</td>
      <td>${formatDate(res.date)}</td>
      <td>${formatTime(res.time)}</td>
      <td>${res.guests}</td>
      <td>${res.specialRequests ? escapeHtml(res.specialRequests.substring(0, 50)) : '-'}</td>
      <td>
        <select onchange="updateReservationStatus('${res._id}', this.value)" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-dark);color:var(--text-primary);font-size:12px;cursor:pointer;">
          <option value="pending" ${res.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${res.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="cancelled" ${res.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          <option value="completed" ${res.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <button onclick="sendWhatsAppNotification('${res._id}', '${res.status}')" class="whatsapp-btn" title="Send WhatsApp Notification" style="background:none;border:none;color:#25D366;cursor:pointer;font-size:16px;padding:5px;">
          <i class="fab fa-whatsapp"></i>
        </button>
      </td>
      <td>
        <div class="actions">
          <button class="delete-btn" onclick="deleteReservation('${res._id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function loadGalleryImages() {
  try {
    const response = await fetch(API_BASE_URL + '/gallery');
    if (!response.ok) throw new Error('Failed to fetch gallery');

    galleryImagesCache = await response.json();
    renderGalleryImages(galleryImagesCache);
  } catch (error) {
    console.error('Error loading gallery:', error);
    showToast('Failed to load gallery images', true);
  }
}

function renderGalleryImages(images) {
  const grid = document.getElementById('gallery-admin-grid');
  if (!grid) return;

  if (!images || images.length === 0) {
    grid.innerHTML = '<div class="loading-gallery">No gallery images found</div>';
    return;
  }

  grid.innerHTML = images.map(img => `
    <div class="gallery-admin-item">
      <img src="${img.imageUrl}" alt="${escapeHtml(img.title)}" style="width:100%;height:180px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/400x300'">
      <div class="gallery-admin-item-content">
        <h4>${escapeHtml(img.title)}</h4>
        <span>${img.category}</span>
        <div class="actions" style="margin-top:10px;">
          <button class="edit-btn" onclick="openGalleryModal('${img._id}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" onclick="deleteGalleryImage('${img._id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

let editingMenuId = null;
let editingGalleryId = null;

function openMenuModal(id = null) {
  editingMenuId = id;
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');

  if (modalTitle) modalTitle.textContent = id ? 'Edit Menu Item' : 'Add Menu Item';
  
  let item = {};
  if (id) {
    item = menuItemsCache.find(i => i._id === id) || {};
  }
  
  if (modalBody) modalBody.innerHTML = getMenuFormHTML(item);

  if (modalOverlay) modalOverlay.classList.add('active');
  if (modal) {
    modal.style.transform = 'scale(1)';
    modal.style.opacity = '1';
  }
  
  attachMenuFormListeners();
}

function getMenuFormHTML(item = {}) {
  return `
    <form id="menu-form">
      <div class="form-group">
        <label for="name">Item Name</label>
        <input type="text" id="name" name="name" required value="${item.name || ''}" placeholder="Enter item name">
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" name="description" required placeholder="Enter description">${item.description || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="price">Price (Rs.)</label>
          <input type="number" id="price" name="price" required min="0" value="${item.price || ''}" placeholder="0">
        </div>
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" name="category" required>
            <option value="">Select category</option>
            <option value="biriyani" ${item.category === 'biriyani' ? 'selected' : ''}>Biriyani</option>
            <option value="starters" ${item.category === 'starters' ? 'selected' : ''}>Starters</option>
            <option value="main-course" ${item.category === 'main-course' ? 'selected' : ''}>Main Course</option>
            <option value="desserts" ${item.category === 'desserts' ? 'selected' : ''}>Desserts</option>
            <option value="beverages" ${item.category === 'beverages' ? 'selected' : ''}>Beverages</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="image">Image URL</label>
        <input type="url" id="image" name="image" value="${item.image || ''}" placeholder="https://example.com/image.jpg">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="spiceLevel">Spice Level</label>
          <select id="spiceLevel" name="spiceLevel">
            <option value="mild" ${item.spiceLevel === 'mild' ? 'selected' : ''}>Mild</option>
            <option value="medium" ${item.spiceLevel === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="spicy" ${item.spiceLevel === 'spicy' ? 'selected' : ''}>Spicy</option>
            <option value="very-spicy" ${item.spiceLevel === 'very-spicy' ? 'selected' : ''}>Very Spicy</option>
          </select>
        </div>
        <div class="form-group">
          <label for="preparationTime">Preparation Time</label>
          <input type="text" id="preparationTime" name="preparationTime" value="${item.preparationTime || '20-30 min'}" placeholder="e.g., 20-30 min">
        </div>
      </div>
      <div class="form-group checkbox-group">
        <input type="checkbox" id="isFeatured" name="isFeatured" ${item.isFeatured ? 'checked' : ''}>
        <label for="isFeatured">Featured Item</label>
      </div>
      <div class="form-group checkbox-group">
        <input type="checkbox" id="isAvailable" name="isAvailable" ${item.isAvailable !== false ? 'checked' : ''}>
        <label for="isAvailable">Available</label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> ${editingMenuId ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  `;
}

function attachMenuFormListeners() {
  const form = document.getElementById('menu-form');
  if (form) {
    form.addEventListener('submit', handleMenuSubmit);
  }
}

async function handleMenuSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price')) || 0,
    category: formData.get('category'),
    image: formData.get('image'),
    spiceLevel: formData.get('spiceLevel') || 'medium',
    preparationTime: formData.get('preparationTime') || '20-30 min',
    isFeatured: formData.get('isFeatured') === 'on',
    isAvailable: formData.get('isAvailable') === 'on'
  };

  try {
    const url = editingMenuId
      ? API_BASE_URL + '/menu/' + editingMenuId
      : API_BASE_URL + '/menu';

    const method = editingMenuId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to save menu item');

    showToast(editingMenuId ? 'Menu item updated!' : 'Menu item added!');
    closeModal();
    loadMenuItems();
  } catch (error) {
    showToast('Failed to save menu item', true);
  }
}

async function deleteMenuItem(id) {
  if (!confirm('Are you sure you want to delete this menu item?')) return;

  try {
    const response = await fetch(API_BASE_URL + '/menu/' + id, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete');

    showToast('Menu item deleted!');
    loadMenuItems();
  } catch (error) {
    showToast('Failed to delete menu item', true);
  }
}

async function updateReservationStatus(id, status, skipWhatsApp = false) {
  try {
    const response = await fetch(API_BASE_URL + '/reservations/' + id, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    if (!response.ok) throw new Error('Failed to update');

    const statusMessages = {
      confirmed: 'Reservation Confirmed!',
      cancelled: 'Reservation Cancelled!',
      pending: 'Reservation Pending!',
      completed: 'Reservation Completed!'
    };
    
    showToast(statusMessages[status] || 'Status Updated!');
    
    if (data.shouldNotify && data.whatsappUrl && !skipWhatsApp) {
      openWhatsAppChat(data.whatsappUrl, status);
    }
    
    loadReservations();
    loadDashboardStats();
  } catch (error) {
    showToast('Failed to update status', true);
  }
}

function openWhatsAppChat(whatsappUrl, status) {
  window.open(whatsappUrl, '_blank');
}

function sendWhatsAppNotification(reservationId, status) {
  const reservation = getReservationById(reservationId);
  if (!reservation) return;

  const date = new Date(reservation.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let message = '';
  if (status === 'confirmed') {
    message = `Hello ${reservation.name}!\n\nYour reservation at *Nujoom Biriyani House* has been *CONFIRMED*.\n\nDate: ${date}\nTime: ${reservation.time}\nGuests: ${reservation.guests}\n\nWe look forward to serving you!`;
  } else if (status === 'cancelled') {
    message = `Hello ${reservation.name},\n\nYour reservation at *Nujoom Biriyani House* for ${date} has been *CANCELLED*.\n\nWe hope to serve you another time!`;
  } else if (status === 'pending') {
    message = `Hello ${reservation.name},\n\nReminder: Your reservation at *Nujoom Biriyani House* is still *PENDING*.\n\nDate: ${date}\nTime: ${reservation.time}\n\nPlease call us to confirm your booking.`;
  }

  const formattedPhone = formatPhoneForWhatsApp(reservation.phone);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

function formatPhoneForWhatsApp(phone) {
  let num = phone.replace(/\D/g, '');
  if (num.startsWith('0')) {
    num = '91' + num.substring(1);
  }
  if (!num.startsWith('91') && num.length === 10) {
    num = '91' + num;
  }
  return num;
}

function getReservationById(id) {
  return reservationsCache.find(r => r._id === id);
}

let reservationsCache = [];

async function deleteReservation(id) {
  if (!confirm('Are you sure you want to delete this reservation?')) return;

  try {
    const response = await fetch(API_BASE_URL + '/reservations/' + id, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete');

    showToast('Reservation deleted!');
    loadReservations();
    loadDashboardStats();
  } catch (error) {
    showToast('Failed to delete reservation', true);
  }
}

function openGalleryModal(id = null) {
  editingGalleryId = id;
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');

  if (modalTitle) modalTitle.textContent = id ? 'Edit Gallery Image' : 'Add Gallery Image';
  
  let image = {};
  if (id) {
    image = galleryImagesCache.find(i => i._id === id) || {};
  }
  
  if (modalBody) modalBody.innerHTML = getGalleryFormHTML(image);

  if (modalOverlay) modalOverlay.classList.add('active');
  if (modal) {
    modal.style.transform = 'scale(1)';
    modal.style.opacity = '1';
  }
  
  attachGalleryFormListeners();
}

function getGalleryFormHTML(image = {}) {
  return `
    <form id="gallery-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" required value="${image.title || ''}" placeholder="Enter image title">
      </div>
      <div class="form-group">
        <label for="imageUrl">Image URL</label>
        <input type="url" id="imageUrl" name="imageUrl" required value="${image.imageUrl || ''}" placeholder="https://example.com/image.jpg">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" name="category">
            <option value="food" ${image.category === 'food' ? 'selected' : ''}>Food</option>
            <option value="interior" ${image.category === 'interior' ? 'selected' : ''}>Interior</option>
            <option value="exterior" ${image.category === 'exterior' ? 'selected' : ''}>Exterior</option>
            <option value="events" ${image.category === 'events' ? 'selected' : ''}>Events</option>
          </select>
        </div>
        <div class="form-group">
          <label for="order">Display Order</label>
          <input type="number" id="order" name="order" value="${image.order || 0}" min="0">
        </div>
      </div>
      <div class="form-group checkbox-group">
        <input type="checkbox" id="isActive" name="isActive" ${image.isActive !== false ? 'checked' : ''}>
        <label for="isActive">Active</label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> ${editingGalleryId ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  `;
}

function attachGalleryFormListeners() {
  const form = document.getElementById('gallery-form');
  if (form) {
    form.addEventListener('submit', handleGallerySubmit);
  }
}

async function handleGallerySubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    title: formData.get('title'),
    imageUrl: formData.get('imageUrl'),
    category: formData.get('category') || 'food',
    order: parseInt(formData.get('order')) || 0,
    isActive: formData.get('isActive') === 'on'
  };

  try {
    const url = editingGalleryId
      ? API_BASE_URL + '/gallery/' + editingGalleryId
      : API_BASE_URL + '/gallery';

    const method = editingGalleryId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to save gallery image');

    showToast(editingGalleryId ? 'Image updated!' : 'Image added!');
    closeModal();
    loadGalleryImages();
  } catch (error) {
    showToast('Failed to save image', true);
  }
}

async function deleteGalleryImage(id) {
  if (!confirm('Are you sure you want to delete this image?')) return;

  try {
    const response = await fetch(API_BASE_URL + '/gallery/' + id, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete');

    showToast('Image deleted!');
    loadGalleryImages();
  } catch (error) {
    showToast('Failed to delete image', true);
  }
}

async function loadReviews() {
  try {
    const response = await fetch(API_BASE_URL + '/reviews/all', {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch reviews');

    const reviews = await response.json();
    renderReviews(reviews);
  } catch (error) {
    console.error('Error loading reviews:', error);
    const tbody = document.getElementById('reviews-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">Error loading reviews</td></tr>';
  }
}

function renderReviews(reviews) {
  const tbody = document.getElementById('reviews-tbody');
  if (!tbody) return;

  if (!reviews || reviews.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">No reviews found</td></tr>';
    return;
  }

  let starsHtml = '';
  tbody.innerHTML = reviews.map(review => {
    starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += i < review.rating ? '<i class="fas fa-star" style="color:var(--primary-color)"></i>' : '<i class="far fa-star" style="color:var(--primary-color)"></i>';
    }
    return `
      <tr>
        <td>
          <strong>${escapeHtml(review.name)}</strong>
          <br><small style="color:var(--text-muted)">${review.phone || 'N/A'}</small>
        </td>
        <td>${starsHtml}</td>
        <td style="max-width:250px;">${escapeHtml(review.review ? review.review.substring(0, 80) : '')}${review.review && review.review.length > 80 ? '...' : ''}</td>
        <td>${formatDate(review.createdAt)}</td>
        <td>
          <span class="status-badge ${review.isApproved ? 'confirmed' : 'pending'}">
            ${review.isApproved ? 'Approved' : 'Pending'}
          </span>
        </td>
        <td>
          <div class="actions">
            ${!review.isApproved ? `
              <button class="edit-btn" onclick="approveReview('${review._id}')" title="Approve">
                <i class="fas fa-check"></i>
              </button>
            ` : ''}
            <button class="delete-btn" onclick="deleteReview('${review._id}')" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function approveReview(id) {
  try {
    const response = await fetch(API_BASE_URL + '/reviews/' + id + '/approve', {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to approve review');

    showToast('Review approved!');
    loadReviews();
  } catch (error) {
    showToast('Failed to approve review', true);
  }
}

async function deleteReview(id) {
  if (!confirm('Are you sure you want to delete this review?')) return;

  try {
    const response = await fetch(API_BASE_URL + '/reviews/' + id, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete');

    showToast('Review deleted!');
    loadReviews();
  } catch (error) {
    showToast('Failed to delete review', true);
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modal-overlay');
  
  if (modal) {
    modal.style.transform = 'scale(0.9)';
    modal.style.opacity = '0';
  }
  
  setTimeout(() => {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }, 300);
  
  editingMenuId = null;
  editingGalleryId = null;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '-';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hour = parseInt(parts[0]);
  const minutes = parts[1];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return hour12 + ':' + minutes + ' ' + ampm;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = 'login.html';
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const icon = toast.querySelector('.toast-icon');
  const messageEl = toast.querySelector('.toast-message');
  
  if (icon) {
    icon.className = isError ? 'toast-icon fas fa-exclamation-circle' : 'toast-icon fas fa-check-circle';
  }
  if (messageEl) {
    messageEl.textContent = message;
  }

  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

