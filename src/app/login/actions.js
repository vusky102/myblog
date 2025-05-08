'use server';

import pool from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function handleLogin(formData) {
  try {
    const username = formData.get('username');
    const password = formData.get('password');

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user);
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      };
    } finally {
      client.release();
    }
  } catch (error) {
    throw error;
  }
}