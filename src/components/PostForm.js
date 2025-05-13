"use client";
import React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PostForm({
    initialPost = { title: "", content: "" },
    onSubmit,
    loading: loadingProp = false,
    errors: errorsProp = {},
    submitLabel = "Submit",
    successMessage = "",
    mode = "create"
}) {
    const router = useRouter();
    const [form, setForm] = useState(initialPost);
    const [loading, setLoading] = useState(loadingProp);
    const [errors, setErrors] = useState(errorsProp);
    const [success, setSuccess] = useState(false);
    const textareaRef = useRef(null);

    // Sync props to state if they change
    // (for edit mode, when initialPost is fetched async)
    // Only update if the id/title/content changes
    React.useEffect(() => {
        if (
            form.title !== initialPost.title ||
            form.content !== initialPost.content ||
            form.id !== initialPost.id
        ) {
            setForm(initialPost);
            if (textareaRef.current) textareaRef.current.innerHTML = initialPost.content || "";
        }
    }, [initialPost]);

    React.useEffect(() => {
        setLoading(loadingProp);
    }, [loadingProp]);

    React.useEffect(() => {
        if (JSON.stringify(errors) !== JSON.stringify(errorsProp)) {
            setErrors(errorsProp);
        }
    }, [errorsProp]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    }

    // Paste image as markdown
    function handlePaste(e) {
        const items = Array.from((e.clipboardData || e.nativeEvent.clipboardData).items);
        const imageItem = items.find((item) => item.type.startsWith("image/"));
        if (!imageItem) return;
        e.preventDefault();
        const file = imageItem.getAsFile();
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            if (!textareaRef.current) return;
            const textarea = textareaRef.current;
            // For contentEditable, insert at caret
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);
            const img = document.createElement("img");
            img.src = dataUrl;
            img.alt = "pasted image";
            range.deleteContents();
            range.insertNode(img);
            range.collapse(false);
        };
        reader.readAsDataURL(file);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess(false);
        setErrors({});
        setLoading(true);
        // Ensure latest contentEditable HTML is captured
        if (textareaRef.current) {
            setForm(f => ({ ...f, content: textareaRef.current.innerHTML }));
        }
        let result;
        if (onSubmit) {
            result = await onSubmit({ ...form, content: textareaRef.current ? textareaRef.current.innerHTML : form.content }, setErrors, setSuccess, setLoading, router);
        }
        setLoading(false);
        if (result === true) {
            setSuccess(true);
            if (successMessage) toast.success(successMessage);
        }
    }

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
                        minLength={3}
                        required
                        className={`w-full border px-3 py-2 rounded ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="content" className="block font-medium mb-1">
                        Content
                    </label>
                    <div
                        id="content"
                        name="content"
                        ref={textareaRef}
                        contentEditable
                        suppressContentEditableWarning={true}
                        onInput={e => {
                            const html = e.currentTarget.innerHTML;
                            setForm(f => ({ ...f, content: html }));
                        }}
                        onPaste={handlePaste}
                        className={`w-full border px-3 py-2 rounded min-h-[120px] outline-none ${errors.content ? "border-red-400" : "border-gray-300"}`}
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 disabled:opacity-50"
                >
                    {loading ? (mode === "edit" ? "Saving…" : "Creating…") : submitLabel}
                </button>
                {success && (
                    <p className="text-green-600 text-center mt-2 animate-fade-in">
                        {successMessage || (mode === "edit" ? "Post updated successfully!" : "Post created successfully!")}
                    </p>
                )}
            </form>
        </div>
    );
}
