-- =============================================
-- Nujoom Biriyani House - Supabase Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Menu Items Table
-- =============================================
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('biriyani', 'starters', 'main-course', 'desserts', 'beverages')),
    image TEXT DEFAULT '',
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    preparation_time VARCHAR(50) DEFAULT '20-30 min',
    spice_level VARCHAR(20) DEFAULT 'medium' CHECK (spice_level IN ('mild', 'medium', 'spicy', 'very-spicy')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Reservations Table
-- =============================================
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) DEFAULT '',
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 50),
    special_requests TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Gallery Images Table
-- =============================================
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'food' CHECK (category IN ('food', 'interior', 'exterior', 'events')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Reviews Table
-- =============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Admin Users Table
-- =============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) DEFAULT 'Admin',
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for better performance
-- =============================================
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_featured ON menu_items(is_featured);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for menu, gallery, reviews
CREATE POLICY "Public can read menu items" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public can read gallery" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT USING (is_approved = true);

-- Admin full access (managed via API, not RLS for this setup)

-- =============================================
-- Sample Data
-- =============================================

-- Insert admin user (password: ChangeThisPassword123!)
-- Note: Run seed script to hash the password properly
INSERT INTO admin_users (email, password, name, role) VALUES 
('admin@nujoombiriyani.com', '$2a$12$placeholder_hash', 'Nujoom Admin', 'superadmin');

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, is_featured, image, preparation_time, spice_level) VALUES
('Hyderabadi Chicken Biriyani', 'Slow-cooked aromatic rice layered with tender chicken, saffron, and traditional spices', 299, 'biriyani', true, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', '25-35 min', 'spicy'),
('Mutton Biriyani', 'Premium mutton pieces marinated overnight, cooked with aged basmati rice', 399, 'biriyani', true, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', '30-40 min', 'spicy'),
('Special Family Biriyani', 'Large portion biriyani with chicken, mutton, and egg for sharing', 599, 'biriyani', true, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400', '35-45 min', 'spicy'),
('Veg Biriyani', 'Aromatic basmati rice cooked with fresh vegetables and mild spices', 199, 'biriyani', false, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400', '20-25 min', 'mild'),
('Paneer Biriyani', 'Fragrant rice layered with marinated paneer cubes and spices', 249, 'biriyani', false, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400', '20-25 min', 'medium'),
('Chicken 65', 'Crispy fried chicken tossed with curry leaves, chilies, and spices', 189, 'starters', true, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400', '15-20 min', 'very-spicy'),
('Apollo Fish', 'Crispy fish pieces in spicy Indo-Chinese style', 229, 'starters', false, 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400', '15-20 min', 'spicy'),
('Chicken Lollipop', 'Juicy chicken drumettes in hot and sweet sauce', 179, 'starters', false, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', '15-20 min', 'medium'),
('Butter Chicken', 'Tender chicken in rich tomato-butter gravy', 249, 'main-course', true, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', '20-25 min', 'medium'),
('Kadai Chicken', 'Chicken cooked with bell peppers in aromatic kadai masala', 229, 'main-course', false, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400', '20-25 min', 'spicy'),
('Mutton Curry', 'Slow-cooked mutton in rich onion-tomato gravy', 299, 'main-course', false, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=400', '30-40 min', 'spicy'),
('Gulab Jamun', 'Soft milk dumplings in rose-scented sugar syrup', 79, 'desserts', false, 'https://images.unsplash.com/photo-1666190077617-7a07a77f1f9b?w=400', '10-15 min', 'mild'),
('Fresh Lime Soda', 'Refreshing lime with soda and mint', 49, 'beverages', false, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', '5 min', 'mild');

-- Insert sample gallery
INSERT INTO gallery_images (title, image_url, category, display_order) VALUES
('Signature Chicken Biriyani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', 'food', 1),
('Restaurant Interior', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', 'interior', 2),
('Mutton Biriyani', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600', 'food', 3),
('Spices Collection', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600', 'food', 4),
('Restaurant Entrance', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', 'exterior', 5),
('Chicken 65', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600', 'food', 6),
('Dining Area', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', 'interior', 7),
('Butter Chicken', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600', 'food', 8);

-- Insert sample reviews
INSERT INTO reviews (name, phone, rating, review, is_approved) VALUES
('Ahmed Khan', '9876543210', 5, 'The best biriyani I have ever had! Incredible flavors and generous portions. This is my go-to place for biriyani in Palakkad.', true),
('Fatima Beevi', '9876543211', 5, 'Authentic taste that reminds me of Hyderabad! The mutton biriyani is absolutely divine. The ambiance is also great for family dinners.', true),
('Rajesh Kumar', '9876543212', 4, 'We celebrated our anniversary here and the experience was memorable. The chicken 65 starter was crispy perfection!', true),
('Priya Nair', '9876543213', 5, 'Amazing vegetarian options! The paneer biriyani is excellent. Staff is very friendly and attentive.', true),
('Mohammed Ali', '9876543214', 5, 'Best biriyani in Palakkad! The dum biriyani has authentic taste. Highly recommended!', true),
('Sneha Menon', '9876543215', 4, 'Great food and good service. The butter chicken was creamy and delicious. Will definitely come back.', true);
