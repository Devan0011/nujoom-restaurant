// ============================================
// SITE CONFIGURATION
// Edit these values to customize your site
// ============================================

const SITE_CONFIG = {
  // Restaurant Details
  name: "Nujoom Biriyani House",
  tagline: "Authentic Biriyani in Palakkad",
  
  // Phone numbers (without +91)
  phone: "+918848541003",
  whatsapp: "8848541003",  // Just the number without country code
  
  // Address
  address: "Main Road, Near Clock Tower",
  city: "Palakkad",
  state: "Kerala",
  pincode: "678001",
  
  // Email
  email: "info@nujoombiriyani.com",
  
  // Opening hours
  timing: "11:00 AM - 11:00 PM",
  
  // WhatsApp message templates
  getWhatsAppUrl: (message) => `https://wa.me/91${SITE_CONFIG.whatsapp}?text=${message}`,
  
  getPhoneLink: () => `tel:${SITE_CONFIG.phone}`,
  
  getWhatsAppLink: () => `https://wa.me/91${SITE_CONFIG.whatsapp}`
};

window.SITE_CONFIG = SITE_CONFIG;
