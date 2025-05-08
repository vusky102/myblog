import pool from '@/lib/db';

const PostPage = async ({ params }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="text-gray-500 text-sm mb-8 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="prose max-w-none text-gray-600">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default PostPage;