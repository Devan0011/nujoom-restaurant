const bcrypt = require('bcryptjs');
const { menuItems, galleryImages, reviews } = require('../data/seed-data');

const DUMMY_ID = '00000000-0000-0000-0000-000000000000';

async function clearTable(supabase, table) {
  const { error } = await supabase.from(table).delete().neq('id', DUMMY_ID);
  if (error) {
    throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

async function seedDatabase(supabase, options) {
  const hashedPassword = await bcrypt.hash(options.adminPassword, 12);

  const { error: adminError } = await supabase.from('admin_users').upsert(
    [
      {
        email: options.adminEmail.toLowerCase(),
        password: hashedPassword,
        name: options.adminName || 'Nujoom Admin',
        role: 'superadmin',
      },
    ],
    { onConflict: 'email' }
  );

  if (adminError) {
    throw new Error(`Failed to seed admin user: ${adminError.message}`);
  }

  await clearTable(supabase, 'menu_items');
  await clearTable(supabase, 'gallery_images');
  await clearTable(supabase, 'reviews');

  const { error: menuError } = await supabase.from('menu_items').insert(menuItems);
  if (menuError) {
    throw new Error(`Failed to seed menu items: ${menuError.message}`);
  }

  const { error: galleryError } = await supabase.from('gallery_images').insert(galleryImages);
  if (galleryError) {
    throw new Error(`Failed to seed gallery: ${galleryError.message}`);
  }

  const { error: reviewsError } = await supabase.from('reviews').insert(reviews);
  if (reviewsError) {
    throw new Error(`Failed to seed reviews: ${reviewsError.message}`);
  }

  return {
    menuItems: menuItems.length,
    galleryImages: galleryImages.length,
    reviews: reviews.length,
  };
}

module.exports = {
  seedDatabase,
};
