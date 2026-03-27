import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'empiros_secret_key_123',
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret_default',
    { expiresIn: '7d' }
  );
};

const generateToken = (userId, role) => {
  return generateAccessToken(userId, role);
};

export default generateToken;
