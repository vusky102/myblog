export const dynamic = 'force-dynamic';
import he from 'he';
import Link from 'next/link';
import pool from '@/lib/db';

const HomePage = async () => {
  const client = await pool.connect();
  let posts;
  try {
    const result = await client.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    posts = result.rows;
  } finally {
    client.release();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="container mx-auto px-4 py-12 text-center relative">
        {/* logo */}
        <img
          src="/static/logo.jpg"
          alt="Lucas’s Blog Logo"
          className="mx-auto w-30 h-30 mb-5 shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8">
          Lucas Tech Blog
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Endless quest through the ever-evolving world of
        </p>
        <p className="text-xl text-gray-600 mb-12">
          technology and development
        </p>
        {/* subtle watermark behind text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img
            src="/static/logo.jpg"
            alt=""
            className="w-120 h-90"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
          {posts.map((post) => {
            // strip tags + excerpt logic...
            const raw = post.content;
            const withoutImages = raw.replace(/<img[^>]*>/gi, '');
            const withoutTags = withoutImages.replace(/<[^>]+>/g, '');
            const decoded = he.decode(withoutTags);
            const excerpt = decoded
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 200);

            return (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <div className="text-gray-500 text-sm mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
                  <div className="flex justify-end">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center transition-colors"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
