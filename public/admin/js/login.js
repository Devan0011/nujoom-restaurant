const API_BASE_URL = window.getNujoomApiBaseUrl ? window.getNujoomApiBaseUrl() : '/api';

function initLoginForm() {
  const form = document.getElementById('login-form');
  const submitButton = document.getElementById('login-btn');
  const errorElement = document.getElementById('form-error');

  if (!form || !submitButton || !errorElement) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    submitButton.classList.add('loading');
    submitButton.disabled = true;
    errorElement.textContent = '';

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorElement.textContent = data.error || 'Invalid credentials';
        return;
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      window.location.href = '/admin/dashboard.html';
    } catch (error) {
      errorElement.textContent = 'Network error. Please try again.';
    } finally {
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  });
}

function initPasswordToggle() {
  const toggleButton = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');
  if (!toggleButton || !passwordInput) return;

  toggleButton.addEventListener('click', () => {
    const icon = toggleButton.querySelector('i');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    if (icon) {
      icon.classList.toggle('fa-eye', !isPassword);
      icon.classList.toggle('fa-eye-slash', isPassword);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initPasswordToggle();
});
