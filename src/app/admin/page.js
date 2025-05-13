"use client";
import { useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";
import toast from "react-hot-toast";

export default function AdminPage() {
  const router = useRouter();

  async function handleCreate(form, setErrors, setSuccess, setLoading, router) {
    setErrors({});
    setSuccess(false);
    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
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
      toast.error("Failed to create post");
      return false;
    }
    setSuccess(true);
    setTimeout(() => {
      router.replace("/admin");
    }, 1200);
    return true;
  }

  return (
    <PostForm
      initialPost={{ title: "", content: "" }}
      onSubmit={handleCreate}
      submitLabel="Create Post"
      successMessage="Post created successfully!"
      mode="create"
    />
  );
}