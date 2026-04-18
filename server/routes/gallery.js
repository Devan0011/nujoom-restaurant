const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const getSupabase = (req) => req.app.get('supabase');

const transformGalleryImage = (item) => ({
  _id: item.id,
  id: item.id,
  title: item.title,
  imageUrl: item.image_url,
  category: item.category,
  isActive: item.is_active,
  order: item.display_order,
  createdAt: item.created_at
});

router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { category } = req.query;

    let query = supabase.from('gallery_images').select('*').eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data.map(transformGalleryImage));
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ error: 'Error fetching gallery images' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { title, imageUrl, category, order, isActive } = req.body;

    const { data, error } = await supabase
      .from('gallery_images')
      .insert([{
        title,
        image_url: imageUrl,
        category: category || 'food',
        display_order: order || 0,
        is_active: isActive !== false
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(transformGalleryImage(data));
  } catch (error) {
    console.error('Gallery create error:', error);
    res.status(400).json({ error: 'Error adding image' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { title, imageUrl, category, order, isActive } = req.body;

    const { data, error } = await supabase
      .from('gallery_images')
      .update({
        title,
        image_url: imageUrl,
        category: category || 'food',
        display_order: order || 0,
        is_active: isActive !== false
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Image not found' });

    res.json(transformGalleryImage(data));
  } catch (error) {
    console.error('Gallery update error:', error);
    res.status(400).json({ error: 'Error updating image' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting image' });
  }
});

module.exports = router;
