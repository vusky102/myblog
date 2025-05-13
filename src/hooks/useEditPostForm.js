// hooks/useEditPostForm.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useEditPostForm(initialPost, router) {
  const [form, setForm] = useState({
    title: initialPost.title,
    content: initialPost.content
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const res = await fetch(`/api/posts/${initialPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.status === 422) {
      const data = await res.json();
      setErrors(data.errors || {});
      toast.error('Validation error');
    } else if (!res.ok) {
      toast.error('Update failed');
    } else {
      toast.success('Post updated!');
      router.push(`/posts/${initialPost.id}`);
    }

    setLoading(false);
  };

  return { form, setForm, loading, errors, handleChange, handleSubmit };
}
