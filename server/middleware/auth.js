const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const supabase = req.app.get('supabase');
    const config = req.app.get('config');
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', decoded.adminId)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.admin = admin;
    req.adminId = admin.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = auth;
