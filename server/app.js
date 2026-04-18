const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/env');
const { createSupabaseClient } = require('./config/supabase');

const systemRoutes = require('./routes/system');
const menuRoutes = require('./routes/menu');
const reservationRoutes = require('./routes/reservation');
const galleryRoutes = require('./routes/gallery');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

const app = express();
const publicDirectory = path.join(__dirname, '..', 'public');

app.set('config', config);
app.set('supabase', createSupabaseClient(config));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDirectory));

app.use('/api', systemRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

app.get('/menu', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'menu.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'admin', 'dashboard.html'));
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

module.exports = app;
