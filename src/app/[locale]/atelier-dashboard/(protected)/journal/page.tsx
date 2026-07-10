"use client";

import { useEffect, useState } from "react";
import { urlFor } from "@/lib/sanity";
import dynamic from "next/dynamic";

// ✅ استفاده از react-quill-new
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function JournalManager() {
    const [items, setItems] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [titleEn, setTitleEn] = useState("");
    const [titleFa, setTitleFa] = useState("");
    const [slug, setSlug] = useState("");
    const [excerptEn, setExcerptEn] = useState("");
    const [excerptFa, setExcerptFa] = useState("");
    const [contentEn, setContentEn] = useState("");
    const [contentFa, setContentFa] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [existingCoverId, setExistingCoverId] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState<"en" | "fa">("en");

    // ✅ اضافه شد: state برای Preview
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        const res = await fetch("/api/atelier-dashboard/journal");
        const json = await res.json();
        setItems(Array.isArray(json) ? json : json.data || []);
    }

    function handleImage(e: any) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    async function uploadImage() {
        if (!coverImage) return existingCoverId;
        const form = new FormData();
        form.append("file", coverImage);

        const res = await fetch("/api/atelier-dashboard/files/upload", {
            method: "POST",
            body: form,
        });
        const json = await res.json();
        return json?.data?._id ?? null;
    }

    function handleTitleEn(val: string) {
        setTitleEn(val);
        if (!slug && !editingId) {
            setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
        }
    }

    function resetForm() {
        setTitleEn("");
        setTitleFa("");
        setSlug("");
        setExcerptEn("");
        setExcerptFa("");
        setContentEn("");
        setContentFa("");
        setCoverImage(null);
        setCoverPreview(null);
        setExistingCoverId(null);
        setEditingId(null);
        setError("");
        setSuccess("");
        setShowPreview(false);
    }

    async function saveArticle(isEdit = false) {
        if (!titleEn || !titleFa || !slug) {
            setError("Title EN, Title FA and Slug are required");
            return;
        }
        setError("");
        setLoading(true);

        let coverId = existingCoverId;
        if (coverImage) {
            coverId = await uploadImage();
        }

        const url = isEdit && editingId
            ? `/api/atelier-dashboard/journal?id=${editingId}`
            : "/api/atelier-dashboard/journal";

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title_en: titleEn,
                title_fa: titleFa,
                slug,
                excerpt_en: excerptEn,
                excerpt_fa: excerptFa,
                content_en: contentEn,
                content_fa: contentFa,
                cover_image: coverId ? { _type: "image", asset: { _ref: coverId } } : null,
                status: "published",
            }),
        });

        setLoading(false);

        if (res.ok) {
            setSuccess(isEdit ? "Article updated successfully!" : "Article created successfully!");
            resetForm();
            setTimeout(() => setSuccess(""), 3000);
            fetchItems();
        } else {
            setError(isEdit ? "Failed to update article" : "Failed to create article");
        }
    }

    async function editArticle(item: any) {
        setEditingId(item._id);
        setTitleEn(item.title_en || "");
        setTitleFa(item.title_fa || "");
        setSlug(item.slug?.current || item.slug || "");
        setExcerptEn(item.excerpt_en || "");
        setExcerptFa(item.excerpt_fa || "");
        setContentEn(item.content_en || "");
        setContentFa(item.content_fa || "");

        if (item.cover_image) {
            setExistingCoverId(item.cover_image.asset?._ref || item.cover_image);
            try {
                const imgUrl = urlFor(item.cover_image).width(400).url();
                setCoverPreview(imgUrl);
            } catch {
                setCoverPreview(null);
            }
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function deleteArticle(id: string) {
        if (!confirm("Delete this article?")) return;
        await fetch(`/api/atelier-dashboard/journal?id=${id}`, { method: "DELETE" });
        fetchItems();
    }

    function getImageUrl(item: any) {
        if (!item.cover_image) return null;
        try {
            if (item.cover_image.asset) {
                return urlFor(item.cover_image).width(200).url();
            }
            if (typeof item.cover_image === "string") {
                return urlFor({ _type: "image", asset: { _ref: item.cover_image } }).width(200).url();
            }
            return null;
        } catch {
            return null;
        }
    }

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "image"],
            [{ color: [] }, { background: [] }],
            ["blockquote", "code-block"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "align",
        "link",
        "image",
        "color",
        "background",
        "blockquote",
        "code-block",
    ];

    // ✅ استایل‌های سفارشی برای Quill Editor (ارتفاع بیشتر)
    const quillStyles = `
        .quill-editor-large .ql-container {
            min-height: 500px !important;
            font-size: 16px;
            font-family: inherit;
            background: white;
        }
        .quill-editor-large .ql-editor {
            min-height: 500px !important;
            padding: 24px;
            line-height: 1.8;
            color: #1a1a1a;
        }
        .quill-editor-large .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.1) !important;
            background: rgba(255,255,255,0.03);
            padding: 12px 8px;
        }
        .quill-editor-large .ql-container {
            border: none !important;
        }
        .quill-editor-large .ql-editor.ql-blank::before {
            color: #a3a3a3;
            font-style: normal;
            left: 24px;
            right: 24px;
        }
        .quill-editor-large .ql-snow .ql-stroke {
            stroke: #D4AF37;
        }
        .quill-editor-large .ql-snow .ql-fill {
            fill: #D4AF37;
        }
        .quill-editor-large .ql-snow .ql-picker {
            color: #D4AF37;
        }
        .quill-editor-large .ql-snow .ql-picker-options {
            background: #1a1a1a;
            border-color: rgba(212, 175, 55, 0.3);
        }
        .quill-editor-large .ql-snow .ql-picker-label {
            color: #D4AF37;
        }
        
        /* Preview Modal Styles */
        .preview-prose h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 1.5rem;
            color: white;
        }
        .preview-prose h2 {
            font-size: 2rem;
            font-weight: 300;
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, #ffffff, #D4AF37);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        .preview-prose h3 {
            font-size: 1.5rem;
            font-weight: 400;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #D4AF37;
        }
        .preview-prose p {
            font-size: 1.125rem;
            line-height: 2;
            color: #e5e5e5;
            margin-bottom: 1.5rem;
        }
        .preview-prose blockquote {
            border-left: 3px solid #D4AF37;
            padding: 1.5rem 2rem;
            margin: 2.5rem 0;
            background: rgba(212, 175, 55, 0.05);
            border-radius: 0 12px 12px 0;
            font-style: italic;
            font-size: 1.25rem;
            color: #FFE8A3;
        }
        .preview-prose ul, .preview-prose ol {
            margin: 1.5rem 0;
            padding-left: 2rem;
        }
        .preview-prose li {
            margin-bottom: 0.75rem;
            color: #e5e5e5;
            line-height: 1.8;
        }
        .preview-prose a {
            color: #D4AF37;
            text-decoration: underline;
            text-underline-offset: 4px;
        }
        .preview-prose strong {
            color: #FFE8A3;
            font-weight: 500;
        }
        .preview-prose img {
            border-radius: 16px;
            margin: 2rem auto;
            max-width: 100%;
        }
    `;

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            {/* ✅ استایل‌های سفارشی */}
            <style>{quillStyles}</style>

            <div className="pointer-events-none fixed inset-0">
                <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[140px]" />
                <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-white/[0.02] blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                <div className="mb-12">
                    <h1 className="text-4xl font-light tracking-wide">
                        <span className="bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
                            Journal Manager
                        </span>
                    </h1>
                    <p className="mt-2 text-sm text-[#a3a3a3]">
                        {editingId ? "Edit existing article" : "Create a new article"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
                        {success}
                    </div>
                )}

                <div className="mb-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-light text-white">
                            {editingId ? "Edit Article" : "New Article"}
                        </h2>
                        {editingId && (
                            <button
                                onClick={resetForm}
                                className="text-sm text-[#a3a3a3] hover:text-white transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Titles */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                    Title (EN) *
                                </label>
                                <input
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
                                    placeholder="Article title in English"
                                    value={titleEn}
                                    onChange={(e) => handleTitleEn(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                    Title (FA) *
                                </label>
                                <input
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
                                    placeholder="عنوان مقاله به فارسی"
                                    value={titleFa}
                                    onChange={(e) => setTitleFa(e.target.value)}
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                Slug * (URL-friendly)
                            </label>
                            <input
                                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
                                placeholder="my-article-slug"
                                value={slug}
                                onChange={(e) =>
                                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
                                }
                            />
                            <p className="mt-2 text-xs text-[#a3a3a3]">
                                Example: aureldesign.ir/en/journal/{slug || "your-slug-here"}
                            </p>
                        </div>

                        {/* Excerpts */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                    Excerpt (EN)
                                </label>
                                <textarea
                                    className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
                                    placeholder="Short description in English"
                                    value={excerptEn}
                                    onChange={(e) => setExcerptEn(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                    Excerpt (FA)
                                </label>
                                <textarea
                                    className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
                                    placeholder="توضیح کوتاه به فارسی"
                                    value={excerptFa}
                                    onChange={(e) => setExcerptFa(e.target.value)}
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div>
                            <div className="mb-4 flex gap-4 border-b border-white/10">
                                <button
                                    onClick={() => setActiveTab("en")}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "en"
                                        ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                                        : "text-[#a3a3a3] hover:text-white"
                                        }`}
                                >
                                    English Content
                                </button>
                                <button
                                    onClick={() => setActiveTab("fa")}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "fa"
                                        ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                                        : "text-[#a3a3a3] hover:text-white"
                                        }`}
                                >
                                    فارسی
                                </button>
                            </div>

                            {/* English Content */}
                            {activeTab === "en" && (
                                <div>
                                    <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                        Content (EN) — Visual Editor
                                    </label>
                                    <div className="quill-editor-large rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                        <ReactQuill
                                            key={`en-${editingId || 'new'}`}
                                            theme="snow"
                                            value={contentEn}
                                            onChange={setContentEn}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Start writing your article here..."
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-[#a3a3a3]">
                                        Use the toolbar above to format your text, add images, links, lists, etc.
                                    </p>
                                </div>
                            )}

                            {/* Persian Content */}
                            {activeTab === "fa" && (
                                <div>
                                    <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                        Content (FA) — Visual Editor
                                    </label>
                                    <div className="quill-editor-large rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                                        <ReactQuill
                                            key={`fa-${editingId || 'new'}`}
                                            theme="snow"
                                            value={contentFa}
                                            onChange={setContentFa}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="مقاله خود را اینجا بنویسید..."
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-[#a3a3a3]">
                                        از نوار ابزار بالا برای فرمت‌دهی متن، اضافه کردن تصویر، لینک، لیست و... استفاده کنید.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                Cover Image
                            </label>
                            <div className="flex items-start gap-6">
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-[#D4AF37] file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-[#FFE8A3]"
                                    />
                                    <p className="mt-2 text-xs text-[#a3a3a3]">
                                        Recommended: 1200x630px or larger
                                    </p>
                                </div>
                                {coverPreview && (
                                    <div className="relative">
                                        <img
                                            src={coverPreview}
                                            alt="Preview"
                                            className="h-32 w-48 rounded-xl border border-white/10 object-cover"
                                        />
                                        <button
                                            onClick={() => {
                                                setCoverImage(null);
                                                setCoverPreview(null);
                                                if (!editingId) setExistingCoverId(null);
                                            }}
                                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => setShowPreview(true)}
                                disabled={!titleEn && !titleFa}
                                className="rounded-xl border border-[#D4AF37]/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                👁 Preview
                            </button>

                            <button
                                onClick={() => saveArticle(!!editingId)}
                                disabled={loading}
                                className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8B7332] px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black transition-all hover:from-[#FFE8A3] hover:to-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? "Saving..." : editingId ? "Update Article" : "Create Article"}
                            </button>

                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="rounded-xl border border-white/20 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all hover:border-white/40"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Articles List */}
                <div>
                    <h2 className="mb-6 text-xl font-light text-white">
                        Articles ({items.length})
                    </h2>

                    {items.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
                            <p className="text-[#a3a3a3]">No articles yet. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const imgUrl = getImageUrl(item);
                                return (
                                    <div
                                        key={item._id}
                                        className="group flex items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-[#D4AF37]/30 hover:bg-white/[0.04]"
                                    >
                                        {imgUrl ? (
                                            <img
                                                src={imgUrl}
                                                alt={item.title_en}
                                                className="h-20 w-32 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-xs text-[#a3a3a3]">
                                                No Image
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <h3 className="truncate text-lg font-light text-white group-hover:text-[#FFE8A3] transition-colors">
                                                {item.title_en}
                                            </h3>
                                            <p className="text-sm text-[#a3a3a3]" dir="rtl">
                                                {item.title_fa}
                                            </p>
                                            <p className="mt-1 text-xs font-mono text-[#D4AF37]">
                                                /journal/{item.slug?.current || item.slug}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => editArticle(item)}
                                                className="rounded-lg border border-[#D4AF37]/30 px-4 py-2 text-xs font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
                                            >
                                                Edit
                                            </button>
                                            <a
                                                href={`/en/journal/${item.slug?.current || item.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-white transition-all hover:border-white/40"
                                            >
                                                View →
                                            </a>
                                            <button
                                                onClick={() => deleteArticle(item._id)}
                                                className="rounded-lg px-4 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/10"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={() => setShowPreview(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#070707] shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#070707]/95 px-8 py-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                                <h3 className="text-lg font-light text-white">
                                    Article Preview
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-white/40 hover:bg-white/5"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="p-8 md:p-12">
                            {/* Category Badge */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                                <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                    Preview Mode
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent">
                                    {titleEn || titleFa || "Article Title"}
                                </span>
                            </h1>

                            {/* Meta Info */}
                            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7332]">
                                        <span className="text-sm font-medium text-black">A</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Aurel Studio</p>
                                        <p className="text-xs text-[#a3a3a3]">Design Team</p>
                                    </div>
                                </div>

                                <div className="hidden h-8 w-px bg-white/10 sm:block" />

                                <div className="flex items-center gap-2 text-sm text-[#a3a3a3]">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Preview</span>
                                </div>

                                <div className="hidden h-8 w-px bg-white/10 sm:block" />

                                <div className="flex items-center gap-2 text-sm text-[#a3a3a3]">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>
                                        {activeTab === "en" ? "English" : "فارسی"}
                                    </span>
                                </div>
                            </div>

                            {/* Cover Image */}
                            {coverPreview && (
                                <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10">
                                    <img
                                        src={coverPreview}
                                        alt="Cover"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>
                            )}

                            {/* Excerpt */}
                            {(activeTab === "en" ? excerptEn : excerptFa) && (
                                <p className="mt-8 text-lg leading-relaxed text-[#e5e5e5] border-l-2 border-[#D4AF37]/40 pl-6">
                                    {activeTab === "en" ? excerptEn : excerptFa}
                                </p>
                            )}

                            {/* Content */}
                            <div
                                className="preview-prose mt-12"
                                dangerouslySetInnerHTML={{
                                    __html: (activeTab === "en" ? contentEn : contentFa) || "<p style='color:#a3a3a3; text-align:center; padding:3rem 0;'>No content yet. Start writing in the editor...</p>"
                                }}
                            />

                            {/* Footer Info */}
                            <div className="mt-16 rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent p-8 text-center">
                                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                                    Preview Mode
                                </p>
                                <p className="mt-2 text-sm text-[#a3a3a3]">
                                    This is how your article will look when published
                                </p>
                                <p className="mt-4 text-xs text-[#a3a3a3]">
                                    Slug: /{activeTab === "en" ? "en" : "fa"}/journal/{slug || "your-slug"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}