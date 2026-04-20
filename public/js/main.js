const API_BASE_URL = window.location.origin + '/api';
let allMenuItems = [];

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-content i');
  
  if (toastMessage) toastMessage.textContent = message;
  if (toastIcon) toastIcon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  
  setTimeout(() => toast.classList.remove('show'), 4500);
}

async function fetchMenuItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    const items = await response.json();
    allMenuItems = items;
    renderMenuItems(items);
    renderFeaturedDishes(items.filter(item => item.isFeatured));
  } catch (error) {
    const menuLoading = document.getElementById('menu-loading');
    if (menuLoading) menuLoading.innerHTML = '<p>Failed to load menu. Please refresh the page.</p>';
  }
}

async function fetchGalleryImages() {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`);
    if (!response.ok) throw new Error('Failed to fetch gallery');
    const images = await response.json();
    renderGalleryImages(images);
  } catch (error) {
    console.error('Error fetching gallery:', error);
  }
}

async function fetchReviews() {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const reviews = await response.json();
    renderReviews(reviews);
  } catch (error) {
    renderStaticReviews();
  }
}

function renderReviews(reviewsList) {
  const reviewsGrid = document.getElementById('reviews-grid');
  if (!reviewsGrid) return;
  
  if (!reviewsList || reviewsList.length === 0) {
    renderStaticReviews();
    return;
  }

  reviewsGrid.innerHTML = reviewsList.slice(0, 6).map(review => `
    <div class="review-card">
      <div class="review-header">
        <img src="${review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=d4af37&color=0a0a0a`}" alt="${review.name}" class="review-avatar" onerror="this.src='https://via.placeholder.com/55x55?text=User'">
        <div class="review-info">
          <h4>${escapeHtml(review.name)}</h4>
          <span>${formatReviewDate(review.date)}</span>
        </div>
      </div>
      <div class="review-stars">${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}</div>
      <p class="review-text">"${escapeHtml(review.review)}"</p>
    </div>
  `).join('');
  
  observeAnimations();
}

function renderStaticReviews() {
  const reviewsGrid = document.getElementById('reviews-grid');
  if (!reviewsGrid) return;
  
  const staticReviews = [
    { name: 'Ahmed Khan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5, review: 'The best biriyani I have ever had! Incredible flavors and generous portions.', date: '2024-01-15' },
    { name: 'Fatima Beevi', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 5, review: 'Authentic taste that reminds me of Hyderabad! Mutton biriyani is divine.', date: '2024-01-10' },
    { name: 'Rajesh Kumar', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', rating: 4, review: 'Celebrated our anniversary here. Memorable experience with great service.', date: '2024-01-05' }
  ];
  
  reviewsGrid.innerHTML = staticReviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <img src="${review.avatar}" alt="${review.name}" class="review-avatar">
        <div class="review-info">
          <h4>${review.name}</h4>
          <span>${formatReviewDate(review.date)}</span>
        </div>
      </div>
      <div class="review-stars">${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}</div>
      <p class="review-text">"${escapeHtml(review.review)}"</p>
    </div>
  `).join('');
  
  observeAnimations();
}

function formatReviewDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderMenuItems(items) {
  const menuGrid = document.getElementById('menu-grid');
  const menuLoading = document.getElementById('menu-loading');
  if (!menuGrid) return;
  
  menuGrid.innerHTML = '';
  if (menuLoading) menuLoading.style.display = 'none';

  if (!items || items.length === 0) {
    menuGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-muted);padding:50px;font-size:16px;">No menu items available</p>';
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.style.animationDelay = `${index * 0.05}s`;
    card.innerHTML = `
      <div class="menu-card-image">
        <img src="${item.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200'}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x200?text=Food'">
      </div>
      <div class="menu-card-content">
        <div class="menu-card-header">
          <h3>${escapeHtml(item.name)}</h3>
          <span class="menu-price">₹${item.price}</span>
        </div>
        <p>${escapeHtml(item.description)}</p>
        <div class="menu-card-footer">
          <span class="menu-time"><i class="far fa-clock"></i> ${escapeHtml(item.preparationTime || '20-30 min')}</span>
          <span class="spice-badge ${item.spiceLevel || 'medium'}">${getSpiceEmoji(item.spiceLevel)}</span>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
  
  observeAnimations();
}

function renderFeaturedDishes(items) {
  const featuredDishes = document.getElementById('featured-dishes');
  if (!featuredDishes) return;
  featuredDishes.innerHTML = '';

  if (!items || items.length === 0) return;

  items.slice(0, 3).forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'featured-card';
    card.style.animationDelay = `${index * 0.15}s`;
    card.innerHTML = `
      <span class="featured-badge">Chef's Special</span>
      <img src="${item.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x250?text=Featured'">
      <div class="featured-card-content">
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="featured-card-footer">
          <span class="featured-price">₹${item.price}</span>
          <span class="spice-badge ${item.spiceLevel || 'medium'}">${getSpiceEmoji(item.spiceLevel)}</span>
        </div>
      </div>
    `;
    featuredDishes.appendChild(card);
  });
  
  observeAnimations();
}

function renderGalleryImages(images) {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';

  if (!images || images.length === 0) return;

  images.forEach((image, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${index * 0.1}s`;
    item.innerHTML = `
      <img src="${image.imageUrl}" alt="${escapeHtml(image.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image'">
      <div class="gallery-overlay">
        <h4>${escapeHtml(image.title)}</h4>
      </div>
    `;
    galleryGrid.appendChild(item);
  });
}

function getSpiceEmoji(level) {
  const map = {
    'mild': '<i class="fas fa-seedling"></i>',
    'medium': '<i class="fas fa-pepper-hot"></i><i class="fas fa-pepper-hot"></i>',
    'spicy': '<i class="fas fa-pepper-hot"></i><i class="fas fa-pepper-hot"></i><i class="fas fa-pepper-hot"></i>',
    'very-spicy': '<i class="fas fa-fire"></i>'
  };
  return map[level] || map['medium'];
}

function initMenuTabs() {
  const menuTabs = document.querySelectorAll('.menu-tab');
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.category;
      const filtered = category === 'all' ? allMenuItems : allMenuItems.filter(item => item.category === category);
      renderMenuItems(filtered);
    });
  });
}

const WHATSAPP_NUMBER = window.SITE_CONFIG ? window.SITE_CONFIG.whatsapp : "8848541003";
const RESERVATION_TEXT = window.SITE_CONFIG ? window.SITE_CONFIG.reservationMessage : (data) => `*New Table Reservation*`;
const REVIEW_TEXT = window.SITE_CONFIG ? window.SITE_CONFIG.reviewMessage : (data) => `*New Review*`;

function initReservationForm() {
  const reservationForm = document.getElementById('reservation-form');
  if (!reservationForm) return;

  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = new FormData(reservationForm);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: parseInt(formData.get('guests')) || 1,
      specialRequests: formData.get('specialRequests')
    };

    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        showToast(result.message || 'Reservation submitted successfully!');
        reservationForm.reset();
      } else {
        showToast(result.error || 'Failed to submit reservation', true);
      }
    } catch (error) {
      showToast('Network error. Please try again.', true);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

function initReviewForm() {
  const reviewForm = document.getElementById('review-form');
  if (!reviewForm) return;

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = reviewForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    const formData = new FormData(reviewForm);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      rating: parseInt(formData.get('rating')),
      review: formData.get('review')
    };

    if (!data.name || !data.rating || !data.review) {
      showToast('Please fill all required fields', true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        showToast('Thank you for your review!');
        reviewForm.reset();
        fetchReviews();
      } else {
        showToast(result.error || 'Failed to submit review', true);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
    }
  });
}

function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
      if (mobileMenu) mobileMenu.classList.remove('active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 90;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
}

function setMinDate() {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  const particleCount = 40;
  const colors = ['#d4af37', '#b8960c', '#f0d875', '#c41e3a'];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 5 + 3) + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
    particle.style.animationDelay = (Math.random() * 15) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    container.appendChild(particle);
  }
}

function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2500;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString() + '+';
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString() + '+';
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

function observeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.feature, .featured-card, .why-card, .review-card, .contact-card, .stat-item, .menu-card').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.08}s`;
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchMenuItems();
  fetchGalleryImages();
  fetchReviews();
  initMenuTabs();
  initReservationForm();
  initReviewForm();
  initNavigation();
  setMinDate();
  createParticles();
  animateCounters();
  observeAnimations();
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});
