'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPostControls({ postId, onEdit, onDeleted }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      setShowModal(false);
      if (onDeleted) onDeleted();
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button
        aria-label="Edit Post"
        className="p-2 rounded-full bg-cyan-500 hover:bg-white hover:text-cyan-600 text-white transition-colors shadow"
        onClick={onEdit}
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v-6H3v6z" /></svg>
      </button>
      <button
        aria-label="Delete Post"
        className="p-2 rounded-full bg-red-500 hover:bg-white hover:text-red-600 text-white transition-colors shadow"
        onClick={() => setShowModal(true)}
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative animate-modalIn">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Post?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure?</p>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.2s; }
        .animate-modalIn { animation: modalIn 0.25s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}