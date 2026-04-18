const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const getSupabase = (req) => req.app.get('supabase');

const transformReservation = (item) => ({
  _id: item.id,
  id: item.id,
  name: item.name,
  phone: item.phone,
  email: item.email,
  date: item.date,
  time: item.time,
  guests: item.guests,
  specialRequests: item.special_requests,
  status: item.status,
  createdAt: item.created_at
});

function formatWhatsAppNumber(phone) {
  let num = phone.replace(/\D/g, '');
  if (num.startsWith('0')) {
    num = '91' + num.substring(1);
  }
  if (!num.startsWith('91') && num.length === 10) {
    num = '91' + num;
  }
  return num;
}

function generateStatusMessage(reservation, newStatus) {
  const name = reservation.name;
  const date = new Date(reservation.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const time = reservation.time;
  const guests = reservation.guests;

  let message = '';

  if (newStatus === 'confirmed') {
    message = `Hello ${name}! \n\nYour reservation at *Nujoom Biriyani House* has been *CONFIRMED*.\n\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\n\nWe look forward to serving you!`;
  } else if (newStatus === 'cancelled') {
    message = `Hello ${name},\n\nYour reservation at *Nujoom Biriyani House* for ${date} has been *CANCELLED*.\n\nWe hope to serve you another time!`;
  } else if (newStatus === 'pending') {
    message = `Hello ${name},\n\nReminder: Your reservation at *Nujoom Biriyani House*.\n\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\n\nPlease confirm your visit by calling us.`;
  }

  return encodeURIComponent(message);
}

function generateWhatsAppUrl(phone, message) {
  const formattedPhone = formatWhatsAppNumber(phone);
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').trim().notEmpty().withMessage('Time is required'),
  body('guests').isInt({ min: 1, max: 50 }).withMessage('Guests must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supabase = getSupabase(req);
    const { name, phone, email, date, time, guests, specialRequests } = req.body;

    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        name,
        phone,
        email: email || '',
        date,
        time,
        guests,
        special_requests: specialRequests || '',
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Reservation submitted successfully! We will contact you shortly.',
      reservation: transformReservation(data)
    });
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ error: 'Error submitting reservation' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { status, date, page = 1, limit = 20 } = req.query;
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    let query = supabase.from('reservations').select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }
    if (date) {
      query = query.eq('date', date);
    }

    const from = (pageNumber - 1) * limitNumber;
    const { data, error, count } = await query
      .order('date', { ascending: false })
      .order('time', { ascending: true })
      .range(from, from + limitNumber - 1);

    if (error) throw error;

    res.json({
      reservations: data.map(transformReservation),
      total: count || data.length,
      page: pageNumber,
      pages: Math.ceil((count || data.length) / limitNumber)
    });
  } catch (error) {
    console.error('Reservations fetch error:', error);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const today = new Date().toISOString().split('T')[0];
    const monthStart = today.substring(0, 7) + '-01';

    const [pendingResult, todayResult, totalResult, monthResult, recentResult] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('date', today),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).gte('date', monthStart),
      supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    res.json({
      pendingCount: pendingResult.count || 0,
      todayCount: todayResult.count || 0,
      totalCount: totalResult.count || 0,
      thisMonth: monthResult.count || 0,
      recentReservations: (recentResult.data || []).map(transformReservation)
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const updates = {};

    if (typeof req.body.status === 'string') updates.status = req.body.status;
    if (typeof req.body.name === 'string') updates.name = req.body.name;
    if (typeof req.body.phone === 'string') updates.phone = req.body.phone;
    if (typeof req.body.email === 'string') updates.email = req.body.email;
    if (typeof req.body.date === 'string') updates.date = req.body.date;
    if (typeof req.body.time === 'string') updates.time = req.body.time;
    if (typeof req.body.guests === 'number') updates.guests = req.body.guests;
    if (typeof req.body.guests === 'string' && req.body.guests.trim() !== '') {
      const guests = parseInt(req.body.guests, 10);
      if (!Number.isNaN(guests)) updates.guests = guests;
    }
    if (typeof req.body.specialRequests === 'string') updates.special_requests = req.body.specialRequests;
    if (typeof req.body.special_requests === 'string') updates.special_requests = req.body.special_requests;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    const { data: oldReservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !oldReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const { data, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    const response = { reservation: transformReservation(data) };

    if (updates.status && updates.status !== oldReservation.status) {
      const statusToNotify = ['confirmed', 'cancelled', 'pending'];
      if (statusToNotify.includes(updates.status)) {
        const message = generateStatusMessage(data, updates.status);
        response.whatsappUrl = generateWhatsAppUrl(data.phone, message);
        response.shouldNotify = true;
        response.notificationStatus = updates.status;
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: 'Error updating reservation' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const supabase = getSupabase(req);
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting reservation' });
  }
});

module.exports = router;
