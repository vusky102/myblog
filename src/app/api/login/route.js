import { NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }

      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
      }

      if (user.first_login) {
        return NextResponse.json({ redirect: '/change-password' }, { status: 200 });
      }

      const token = generateToken(user);
      return NextResponse.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}