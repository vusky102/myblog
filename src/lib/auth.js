import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Function to verify password
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.is_admin }, JWT_SECRET, {
    expiresIn: '1d'
  });
};

// Middleware to verify JWT token
// Middleware to verify JWT token (updated)
// Middleware to verify JWT token (drop-in replacement)
const verifyToken = (headerOrToken) => {
  if (!headerOrToken) return null;

  // strip "Bearer " if present
  let token = headerOrToken;
  if (typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
      console.error('⚠️ JWT_SECRET missing');
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;   // { id, isAdmin, iat, exp }
  } catch (e) {
    console.error('JWT verify failed:', e.message);
    return null;
  }
};
  
  

export { hashPassword, verifyPassword, generateToken, verifyToken };