// ============================================
// SERVER CONFIGURATION
// Edit these values to configure your site
// ============================================

module.exports = {
  // Server
  port: process.env.PORT || 8000,
  
  // JWT Secret (change this for security)
  jwtSecret: process.env.JWT_SECRET || 'nujoom-secret-key-change-in-production',
  
  // Admin Credentials
  admin: {
    username: 'admin',
    password: 'admin123'  // CHANGE THIS PASSWORD
  },
  
  // Site Details (used in API responses)
  site: {
    name: 'Nujoom Biriyani House',
    phone: '8848541003',
    whatsapp: '8848541003',
    address: 'Main Road, Near Clock Tower',
    city: 'Palakkad',
    state: 'Kerala',
    pincode: '678001',
    email: 'info@nujoombiriyani.com'
  }
};
