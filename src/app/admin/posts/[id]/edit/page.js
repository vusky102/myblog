"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({ title: data.title, content: data.content });
      } else {
        toast.error("Failed to load post");
        router.replace(`/posts/${id}`);
      }
      setLoading(false);
    }
    fetchPost();
  }, [id, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(false);
    setErrors({});
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.status === 422) {
      const data = await res.json();
      setErrors(data.errors || {});
      toast.error("Validation error");
      return;
    }
    if (!res.ok) {
      toast.error("Failed to update post");
      return;
    }
    setSuccess(true);
    toast.success("Post updated!");
    setTimeout(() => {
      router.replace(`/posts/${id}`);
    }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 relative animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
              minLength={3}
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition min-h-[120px] ${errors.content ? 'border-red-400' : 'border-gray-300'}`}
              minLength={10}
              required
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            {loading ? "Loading..." : "Update Post"}
          </button>
          {success && <p className="text-green-600 text-center mt-2 animate-fade-in">Post updated successfully!</p>}
        </form>
      </div>
    </div>
  );
}