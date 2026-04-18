(function configureNujoom() {
  const meta = document.querySelector('meta[name="nujoom-api-base-url"]');
  const metaValue = meta && typeof meta.content === 'string' ? meta.content.trim() : '';
  const override = typeof window.__NUJOOM_API_BASE_URL__ === 'string' ? window.__NUJOOM_API_BASE_URL__.trim() : '';
  const configuredBase = override || metaValue;

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const fallback = isLocalhost ? 'http://localhost:3000/api' : `${window.location.origin}/api`;
  const apiBaseUrl = (configuredBase || fallback).replace(/\/+$/, '');

  window.NujoomConfig = Object.freeze({
    apiBaseUrl,
  });

  window.getNujoomApiBaseUrl = function getNujoomApiBaseUrl() {
    return window.NujoomConfig.apiBaseUrl;
  };
})();
