const express = require('express');
const { seedDatabase } = require('../services/seed-service');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'nujoom-api',
    timestamp: new Date().toISOString(),
  });
});

router.post('/seed', async (req, res) => {
  try {
    const config = req.app.get('config');
    const token = req.header('x-seed-token') || '';
    const isProtectedProduction = config.isProduction && config.seedToken;

    if (isProtectedProduction && token !== config.seedToken) {
      return res.status(403).json({
        error: 'Seed token is invalid or missing.',
      });
    }

    if (config.isProduction && !config.seedToken) {
      return res.status(403).json({
        error: 'SEED_TOKEN is required in production before seeding is allowed.',
      });
    }

    const supabase = req.app.get('supabase');
    const result = await seedDatabase(supabase, {
      adminEmail: config.adminEmail,
      adminPassword: config.adminPassword,
      adminName: 'Nujoom Admin',
    });

    res.json({
      success: true,
      message: 'Database seeded successfully.',
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error seeding database.' });
  }
});

module.exports = router;
