import { generateToken } from '@/lib/auth';
import { setCookie } from 'js-cookie';

const loginHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // TODO: Add your authentication logic here
  const user = await authenticateUser(email, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);

  // Set cookie with token
  setCookie('auth_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400 // 1 day
  });

  return res.status(200).json({ token });
};

export default loginHandler;