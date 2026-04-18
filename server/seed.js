const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const MenuItem = require('./models/MenuItem');
const Admin = require('./models/Admin');
const GalleryImage = require('./models/GalleryImage');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await MenuItem.deleteMany({});
    await Admin.deleteMany({});
    await GalleryImage.deleteMany({});
    await Review.deleteMany({});

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL || 'admin@nujoom.com',
      password: hashedPassword,
      name: 'Nujoom Admin',
      role: 'superadmin'
    });
    await admin.save();
    console.log('Admin created:', admin.email);

    const menuItems = [
      {
        name: 'Hyderabadi Chicken Biriyani',
        description: 'Slow-cooked aromatic rice layered with tender chicken, saffron, and traditional spices',
        price: 299,
        category: 'biriyani',
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        preparationTime: '25-35 min',
        spiceLevel: 'spicy'
      },
      {
        name: 'Mutton Biriyani',
        description: 'Premium mutton pieces marinated overnight, cooked with aged basmati rice',
        price: 399,
        category: 'biriyani',
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
        preparationTime: '30-40 min',
        spiceLevel: 'spicy'
      },
      {
        name: 'Special Family Biriyani',
        description: 'Large portion biriyani with chicken, mutton, and egg for sharing',
        price: 599,
        category: 'biriyani',
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400',
        preparationTime: '35-45 min',
        spiceLevel: 'spicy'
      },
      {
        name: 'Veg Biriyani',
        description: 'Aromatic basmati rice cooked with fresh vegetables and mild spices',
        price: 199,
        category: 'biriyani',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400',
        preparationTime: '20-25 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Paneer Biriyani',
        description: 'Fragrant rice layered with marinated paneer cubes and spices',
        price: 249,
        category: 'biriyani',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400',
        preparationTime: '20-25 min',
        spiceLevel: 'medium'
      },
      {
        name: 'Chicken 65',
        description: 'Crispy fried chicken tossed with curry leaves, chilies, and spices',
        price: 189,
        category: 'starters',
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400',
        preparationTime: '15-20 min',
        spiceLevel: 'very-spicy'
      },
      {
        name: 'Apollo Fish',
        description: 'Crispy fish pieces in spicy Indo-Chinese style',
        price: 229,
        category: 'starters',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400',
        preparationTime: '15-20 min',
        spiceLevel: 'spicy'
      },
      {
        name: 'Chicken Lollipop',
        description: 'Juicy chicken drumettes in hot and sweet sauce',
        price: 179,
        category: 'starters',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
        preparationTime: '15-20 min',
        spiceLevel: 'medium'
      },
      {
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese marinated in tandoori spices',
        price: 169,
        category: 'starters',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
        preparationTime: '15-20 min',
        spiceLevel: 'medium'
      },
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato-butter gravy',
        price: 249,
        category: 'main-course',
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
        preparationTime: '20-25 min',
        spiceLevel: 'medium'
      },
      {
        name: 'Kadai Chicken',
        description: 'Chicken cooked with bell peppers in aromatic kadai masala',
        price: 229,
        category: 'main-course',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
        preparationTime: '20-25 min',
        spiceLevel: 'spicy'
      },
      {
        name: 'Mutton Curry',
        description: 'Slow-cooked mutton in rich onion-tomato gravy',
        price: 299,
        category: 'main-course',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=400',
        preparationTime: '30-40 min',
        spiceLevel: 'spicy'
      },
      {
        name: 'Palak Paneer',
        description: 'Cottage cheese in creamy spinach gravy',
        price: 169,
        category: 'main-course',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        preparationTime: '15-20 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked overnight with butter and cream',
        price: 149,
        category: 'main-course',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        preparationTime: '15-20 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings in rose-scented sugar syrup',
        price: 79,
        category: 'desserts',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1666190077617-7a07a77f1f9b?w=400',
        preparationTime: '10-15 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Rasmalai',
        description: 'Soft cheese patties soaked in sweet saffron milk',
        price: 89,
        category: 'desserts',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1571006682582-78bcdd93e3b0?w=400',
        preparationTime: '10-15 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Qubani Ka Meetha',
        description: 'Traditional Hyderabadi dried apricot dessert',
        price: 99,
        category: 'desserts',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
        preparationTime: '10-15 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime with soda and mint',
        price: 49,
        category: 'beverages',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400',
        preparationTime: '5 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea',
        price: 29,
        category: 'beverages',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
        preparationTime: '5 min',
        spiceLevel: 'mild'
      },
      {
        name: 'Mango Lassi',
        description: 'Thick and creamy yogurt drink with fresh mango',
        price: 79,
        category: 'beverages',
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
        preparationTime: '5 min',
        spiceLevel: 'mild'
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded:', menuItems.length);

    const galleryImages = [
      { title: 'Signature Chicken Biriyani', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', category: 'food', order: 1 },
      { title: 'Restaurant Interior', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', category: 'interior', order: 2 },
      { title: 'Mutton Biriyani', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600', category: 'food', order: 3 },
      { title: 'Spices Collection', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600', category: 'food', order: 4 },
      { title: 'Restaurant Entrance', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', category: 'exterior', order: 5 },
      { title: 'Chicken 65', imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600', category: 'food', order: 6 },
      { title: 'Dining Area', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', category: 'interior', order: 7 },
      { title: 'Butter Chicken', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600', category: 'food', order: 8 }
    ];

    await GalleryImage.insertMany(galleryImages);
    console.log('Gallery images seeded:', galleryImages.length);

    const reviews = [
      { name: 'Ahmed Khan', phone: '9876543210', rating: 5, review: 'The best biriyani I have ever had! Incredible flavors and generous portions. This is my go-to place for biriyani in Palakkad.', isApproved: true },
      { name: 'Fatima Beevi', phone: '9876543211', rating: 5, review: 'Authentic taste that reminds me of Hyderabad! The mutton biriyani is absolutely divine. The ambiance is also great for family dinners.', isApproved: true },
      { name: 'Rajesh Kumar', phone: '9876543212', rating: 4, review: 'We celebrated our anniversary here and the experience was memorable. The chicken 65 starter was crispy perfection!', isApproved: true },
      { name: 'Priya Nair', phone: '9876543213', rating: 5, review: 'Amazing vegetarian options! The paneer biriyani is excellent. Staff is very friendly and attentive.', isApproved: true },
      { name: 'Mohammed Ali', phone: '9876543214', rating: 5, review: 'Best biriyani in Palakkad! The dum biriyani has authentic taste. Highly recommended!', isApproved: true },
      { name: 'Sneha Menon', phone: '9876543215', rating: 4, review: 'Great food and good service. The butter chicken was creamy and delicious. Will definitely come back.', isApproved: true }
    ];

    await Review.insertMany(reviews);
    console.log('Reviews seeded:', reviews.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
