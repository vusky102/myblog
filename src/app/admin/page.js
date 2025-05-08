import { redirect } from 'next/navigation';
import pool from '@/lib/db';

const AdminPage = () => {
  const handleCreatePost = async (formData) => {
    'use server';
    const { title, content } = Object.fromEntries(formData);

    const client = await pool.connect();
    try {
      await client.query('INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3)', [title, content, 1]);
    } finally {
      client.release();
    }

    redirect('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Post</h2>
          <form action={handleCreatePost}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
                id="title"
                name="title"
                type="text"
                placeholder="Post title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                Content
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
                id="content"
                name="content"
                rows="6"
                placeholder="Write your post content here..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;