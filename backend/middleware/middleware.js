const jwt = require('jsonwebtoken');

const checkRole = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, 'token');
    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { checkRole };