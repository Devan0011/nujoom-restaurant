const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('./config/database');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'nujoom-secret-key-change-in-production';
const publicDirectory = path.join(__dirname, '..', 'public');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDirectory));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.getAdmin(username);
  
  if (!admin || !require('bcryptjs').compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: admin.username });
});

app.get('/api/menu', (req, res) => {
  const items = db.getMenuItems();
  res.json(items);
});

app.post('/api/admin/menu', authenticateToken, (req, res) => {
  const { name, description, price, category, image, spiceLevel, isFeatured, preparationTime } = req.body;
  const id = db.addMenuItem({ name, description, price, category, image, spiceLevel: spiceLevel || 'medium', isFeatured: isFeatured ? 1 : 0, preparationTime });
  res.json({ id, message: 'Menu item added' });
});

app.put('/api/admin/menu/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image, spiceLevel, isFeatured, preparationTime } = req.body;
  db.updateMenuItem(parseInt(id), { name, description, price, category, image, spiceLevel, isFeatured: isFeatured ? 1 : 0, preparationTime });
  res.json({ message: 'Menu item updated' });
});

app.delete('/api/admin/menu/:id', authenticateToken, (req, res) => {
  db.deleteMenuItem(parseInt(req.params.id));
  res.json({ message: 'Menu item deleted' });
});

app.get('/api/gallery', (req, res) => {
  const images = db.getGalleryImages();
  res.json(images);
});

app.post('/api/admin/gallery', authenticateToken, (req, res) => {
  const { imageUrl, title } = req.body;
  const id = db.addGalleryImage({ imageUrl, title });
  res.json({ id, message: 'Image added' });
});

app.delete('/api/admin/gallery/:id', authenticateToken, (req, res) => {
  db.deleteGalleryImage(parseInt(req.params.id));
  res.json({ message: 'Image deleted' });
});

app.get('/api/reviews', (req, res) => {
  const reviews = db.getReviews();
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { name, phone, rating, review } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4af37&color=0a0a0a`;
  
  db.addReview({ name, avatar, rating, review, date });
  res.json({ message: 'Review submitted successfully!' });
});

app.delete('/api/admin/reviews/:id', authenticateToken, (req, res) => {
  db.deleteReview(parseInt(req.params.id));
  res.json({ message: 'Review deleted' });
});

app.get('/api/reservations', (req, res) => {
  const reservations = db.getReservations();
  res.json(reservations);
});

app.post('/api/reservations', (req, res) => {
  const { name, phone, email, date, time, guests, specialRequests } = req.body;
  
  db.addReservation({ name, phone, email, date, time, guests, specialRequests, status: 'pending' });
  res.json({ message: 'Reservation submitted successfully!' });
});

app.put('/api/admin/reservations/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  db.updateReservation(parseInt(req.params.id), status);
  res.json({ message: 'Reservation updated' });
});

app.delete('/api/admin/reservations/:id', authenticateToken, (req, res) => {
  db.deleteReservation(parseInt(req.params.id));
  res.json({ message: 'Reservation deleted' });
});

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
