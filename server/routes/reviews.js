const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const getSupabase = (req) => req.app.get('supabase');

const transformReview = (item) => ({
  _id: item.id,
  id: item.id,
  name: item.name,
  phone: item.phone,
  rating: item.rating,
  review: item.review,
  avatar: item.avatar,
  isApproved: item.is_approved,
  createdAt: item.created_at
});

router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json(data.map(transformReview));
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').trim().notEmpty().withMessage('Review is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supabase = getSupabase(req);
    const { name, phone, rating, review } = req.body;

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        name,
        phone: phone || '',
        rating,
        review,
        is_approved: true
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Thank you for your review!',
      review: transformReview(data)
    });
  } catch (error) {
    console.error('Review create error:', error);
    res.status(500).json({ error: 'Error submitting review' });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data.map(transformReview));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

router.put('/:id/approve', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Review not found' });

    res.json(transformReview(data));
  } catch (error) {
    res.status(500).json({ error: 'Error approving review' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting review' });
  }
});

module.exports = router;
