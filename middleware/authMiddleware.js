const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access forbidden' });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Not authorized' });
    }
  };
};

module.exports = authMiddleware;
