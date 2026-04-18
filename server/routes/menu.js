const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get Supabase client
const getSupabase = (req) => req.app.get('supabase');

// Transform Supabase data to match frontend expectations
const transformMenuItem = (item) => ({
  _id: item.id,
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  image: item.image,
  isFeatured: item.is_featured,
  isAvailable: item.is_available,
  preparationTime: item.preparation_time,
  spiceLevel: item.spice_level,
  createdAt: item.created_at,
  updatedAt: item.updated_at
});

router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { category, featured } = req.query;
    
    let query = supabase.from('menu_items').select('*').eq('is_available', true);
    
    if (category) {
      query = query.eq('category', category);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    
    const { data, error } = await query.order('category', { ascending: true }).order('name', { ascending: true });
    
    if (error) throw error;
    
    res.json(data.map(transformMenuItem));
  } catch (error) {
    console.error('Menu fetch error:', error);
    res.status(500).json({ error: 'Server error fetching menu items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(transformMenuItem(data));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { name, description, price, category, image, spiceLevel, preparationTime, isFeatured, isAvailable } = req.body;
    const parsedPrice = Number(price);

    if (!name || !description || !category || Number.isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Name, description, category and valid price are required.' });
    }
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        name,
        description,
        price: parsedPrice,
        category,
        image: image || '',
        spice_level: spiceLevel || 'medium',
        preparation_time: preparationTime || '20-30 min',
        is_featured: isFeatured || false,
        is_available: isAvailable !== false
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(transformMenuItem(data));
  } catch (error) {
    console.error('Menu create error:', error);
    res.status(400).json({ error: 'Error creating menu item' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { name, description, price, category, image, spiceLevel, preparationTime, isFeatured, isAvailable } = req.body;
    const parsedPrice = Number(price);

    if (!name || !description || !category || Number.isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Name, description, category and valid price are required.' });
    }
    
    const { data, error } = await supabase
      .from('menu_items')
      .update({
        name,
        description,
        price: parsedPrice,
        category,
        image: image || '',
        spice_level: spiceLevel || 'medium',
        preparation_time: preparationTime || '20-30 min',
        is_featured: isFeatured || false,
        is_available: isAvailable !== false,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Menu item not found' });
    
    res.json(transformMenuItem(data));
  } catch (error) {
    console.error('Menu update error:', error);
    res.status(400).json({ error: 'Error updating menu item' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});

module.exports = router;
