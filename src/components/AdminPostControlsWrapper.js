'use client';
import AdminPostControls from './AdminPostControls';

export default function AdminPostControlsWrapper({ postId }) {
  const handleEdit = () => {
    window.location.href = `/admin/posts/${postId}/edit`;
  };

  const handleDeleted = () => {
    // Optionally, you can add logic here after deletion
  };

  return (
    <AdminPostControls postId={postId} onEdit={handleEdit} onDeleted={handleDeleted} />
  );
}