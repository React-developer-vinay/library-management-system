// backend/controllers/authController.js
const User = require('../models/User')


exports.login = async (req, res, next) => {
  try {
    // Log incoming request for debugging (mask password)
    const safeBody = { ...req.body, password: req.body?.password ? '***' : undefined };
    console.log('[auth] Login attempt', {
      ip: req.ip || req.connection?.remoteAddress,
      username: req.body?.username,
      body: safeBody,
      ua: req.headers['user-agent'],
    });

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = user.getSignedJwtToken();
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
