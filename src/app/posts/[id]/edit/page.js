import pool from '@/lib/db';
import EditPostForm from '@/components/EditPostForm';

const EditPostPage = async ({ params }) => {
  const { id } = params;
  const client = await pool.connect();
  let post;

  try {
    const result = await client.query('SELECT * FROM posts WHERE id = $1', [id]);
    post = result.rows[0];

    if (!post) {
      throw new Error('Post not found');
    }
  } finally {
    client.release();
  }

  return <EditPostForm initialPost={post} />;
};

export default EditPostPage;