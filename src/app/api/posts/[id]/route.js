import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Helper: Validate and sanitize input
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

export async function PUT(request, { params }) {
  const { id } = await params;
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
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [values.title, values.content, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET(request, { params }) {
  const { id } = await params;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT title, content FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 });
  } finally {
    client.release();
  }
}