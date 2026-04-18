const API_BASE_URL = window.getNujoomApiBaseUrl ? window.getNujoomApiBaseUrl() : '/api';
let allMenuItems = [];

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function getSpiceEmoji(level) {
  const map = {
    mild: '<i class="fas fa-seedling"></i>',
    medium: '<i class="fas fa-pepper-hot"></i><i class="fas fa-pepper-hot"></i>',
    spicy: '<i class="fas fa-pepper-hot"></i><i class="fas fa-pepper-hot"></i><i class="fas fa-pepper-hot"></i>',
    'very-spicy': '<i class="fas fa-fire"></i>',
  };
  return map[level] || map.medium;
}

function renderMenuItems(items) {
  const grid = document.getElementById('menu-grid');
  const loading = document.getElementById('menu-loading');

  if (!grid || !loading) return;
  loading.style.display = 'none';

  if (!items || items.length === 0) {
    grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-muted);">No items found</p>';
    return;
  }

  grid.innerHTML = items
    .map(
      (item) => `
        <div class="menu-card">
          <div class="menu-card-image">
            <img src="${item.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200'}" alt="${escapeHtml(item.name)}" loading="lazy">
          </div>
          <div class="menu-card-content">
            <div class="menu-card-header">
              <h3>${escapeHtml(item.name)}</h3>
              <span class="menu-price">Rs.${item.price}</span>
            </div>
            <p>${escapeHtml(item.description)}</p>
            <div class="menu-card-footer">
              <span class="menu-time"><i class="far fa-clock"></i> ${escapeHtml(item.preparationTime || '20-30 min')}</span>
              <span class="spice-badge ${item.spiceLevel || 'medium'}">${getSpiceEmoji(item.spiceLevel)}</span>
            </div>
          </div>
        </div>
      `
    )
    .join('');
}

async function fetchMenuItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to load menu');
    const items = await response.json();
    allMenuItems = items;
    renderMenuItems(items);
  } catch (error) {
    const loading = document.getElementById('menu-loading');
    if (loading) {
      loading.innerHTML = '<p>Failed to load menu.</p>';
    }
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      if (category === 'all') {
        renderMenuItems(allMenuItems);
      } else {
        renderMenuItems(allMenuItems.filter((item) => item.category === category));
      }
    });
  });
}

function initMobileNav() {
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  if (!mobileMenu || !navMenu) return;

  mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMobileNav();
  fetchMenuItems();
});
