const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const getSupabase = (req) => req.app.get('supabase');

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supabase = getSupabase(req);
    const config = req.app.get('config');
    const { email, password } = req.body;

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    const token = jwt.sign(
      { adminId: admin.id },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supabase = getSupabase(req);
    const config = req.app.get('config');
    const { email, password, name } = req.body;
    const setupToken = req.header('x-setup-token') || '';

    if (!config.adminSetupToken) {
      return res.status(403).json({ error: 'Admin registration is disabled. Set ADMIN_SETUP_TOKEN to enable.' });
    }

    if (setupToken !== config.adminSetupToken) {
      return res.status(403).json({ error: 'Invalid setup token.' });
    }

    const { data: existingAdmin, error: existingAdminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingAdminError && existingAdminError.code !== 'PGRST116') {
      throw existingAdminError;
    }

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || 'Admin',
        role: 'admin'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error creating admin' });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const config = req.app.get('config');
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const { data: admin } = await supabase
      .from('admin_users')
      .select('id, email, name')
      .eq('id', decoded.adminId)
      .single();

    if (!admin) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, admin });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
