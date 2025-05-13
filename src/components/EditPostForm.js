'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useEditPostForm from '@/hooks/useEditPostForm';

export default function EditPostForm({ initialPost }) {
  const router = useRouter();
  const {
    form,
    setForm,       // expose setter so we can update `content`
    loading,
    errors,
    handleChange,
    handleSubmit
  } = useEditPostForm(initialPost, router);

  // We'll need a ref to manipulate cursor position
  const textareaRef = useRef(null);

  // Paste‐handler lifted from your snippet, but injecting into state instead of console.log
  const handlePaste = (e) => {
    const items = Array.from(
      (e.clipboardData || e.nativeEvent.clipboardData).items
    );
    const imageItem = items.find((item) =>
      item.type.startsWith('image/')
    );
    if (!imageItem) return;   // not an image

    e.preventDefault();       // stop the default paste
    const file = imageItem.getAsFile();
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result; // "data:image/png;base64,…"
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd } = textarea;
      const markdownImage = `![pasted image](${dataUrl})`;
      // Insert at cursor
      const newContent =
        form.content.slice(0, selectionStart) +
        markdownImage +
        form.content.slice(selectionEnd);

      // Update state
      setForm((f) => ({ ...f, content: newContent }));

      // Move cursor to just after the inserted markdown
      requestAnimationFrame(() => {
        textarea.selectionStart =
          textarea.selectionEnd =
          selectionStart + markdownImage.length;
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6"
        aria-busy={loading}
      >
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block font-medium mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            ref={textareaRef}
            value={form.content}
            onChange={handleChange}
            onPaste={handlePaste}
            rows={10}
            className="w-full border px-3 py-2 rounded font-mono whitespace-pre-wrap"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
