const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  // Check for Bearer token in Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach minimal user object to request
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
  }
};

module.exports = { protect };
