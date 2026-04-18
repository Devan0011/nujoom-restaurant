const config = require('../server/config/env');
const { createSupabaseClient } = require('../server/config/supabase');
const { seedDatabase } = require('../server/services/seed-service');

async function run() {
  try {
    const supabase = createSupabaseClient(config);
    const result = await seedDatabase(supabase, {
      adminEmail: config.adminEmail,
      adminPassword: config.adminPassword,
      adminName: 'Nujoom Admin',
    });

    console.log('Seed completed successfully.');
    console.log(`Menu items: ${result.menuItems}`);
    console.log(`Gallery images: ${result.galleryImages}`);
    console.log(`Reviews: ${result.reviews}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

run();
