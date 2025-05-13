import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function validatePostInput(data) {
  const errors = {};
  let { title, content } = data;
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else {
    title = title.trim();
  }
  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    errors.content = 'Content must be at least 10 characters.';
  } else {
    content = content.trim();
  }
  return { errors, values: { title, content } };
}

async function getAdminFromRequest(request) {
  const cookie = request.cookies.get('token')?.value;
  if (!cookie) return null;
  const decoded = verifyToken(cookie);
  if (!decoded?.isAdmin) return null;
  return decoded;
}

export async function POST(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
  const { errors, values } = validatePostInput(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [values.title, values.content]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  } finally {
    client.release();
  }
}