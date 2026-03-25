import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized role' });
    }
    next();
  };
};
