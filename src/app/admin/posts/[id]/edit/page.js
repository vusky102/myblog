"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PostForm from "@/components/PostForm";
import toast from "react-hot-toast";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPost({ title: data.title, content: data.content, id });
      } else {
        toast.error("Failed to load post");
        router.replace(`/posts/${id}`);
      }
      setLoading(false);
    }
    fetchPost();
  }, [id, router]);

  async function handleEdit(form, setErrors, setSuccess, setLoading, router) {
    setErrors({});
    setSuccess(false);
    setLoading(true);
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.status === 422) {
      const data = await res.json();
      setErrors(data.errors || {});
      toast.error("Validation error");
      return false;
    }
    if (!res.ok) {
      toast.error("Failed to update post");
      return false;
    }
    setSuccess(true);
    setTimeout(() => {
      router.replace(`/posts/${id}`);
    }, 1200);
    return true;
  }

  return (
    <PostForm
      initialPost={post}
      onSubmit={handleEdit}
      loading={loading}
      errors={errors}
      submitLabel="Update Post"
      successMessage="Post updated successfully!"
      mode="edit"
    />
  );
}