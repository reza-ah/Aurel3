"use client";

import { useEffect, useState, useRef } from "react";
import { urlFor } from "@/lib/sanity";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

// ==========================================
// توابع پردازش و پاک‌سازی محتوا (بدون تغییر)
// ==========================================
function sanitizeContent(html: string, title: string): string {
    if (!html) return "";
    let sanitized = html
        .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
        .replace(/<meta[^>]*>/gi, "")
        .replace(/<\/?(html|head|body)[^>]*>/gi, "")
        .replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, "<h2$1>$2</h2>")
        .replace(/&nbsp;/gi, " ")
        .replace(/\u00a0/g, " ")
        .replace(/color\s*:\s*(?:#000(?:000)?|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|black)\s*;?/gi, "")
        .replace(/<img(?![^>]*\balt=)([^>]*?)>/gi, (match, attrs) => `<img alt="${title}"${attrs}>`)
        .replace(/alt=""/g, `alt="${title}"`)
        .replace(/<[^>]+>\s*<\/[^>]+>/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    return sanitized;
}

function processHeadings(html: string): string {
    if (!html) return "";
    const headings = [...html.matchAll(/<(h[2-6])[^>]*>(.*?)<\/\1>/gi)];
    let processed = html;
    headings.forEach((match, index) => {
        const level = match[1];
        const text = match[2].replace(/<[^>]+>/g, "").trim();
        const baseId = text.toLowerCase().replace(/[^\w\sآ-ی]/g, "").replace(/\s+/g, "-").trim();
        const id = baseId.length > 0 ? `${baseId}-${index}` : `section-${index}`;
        const safeText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`<${level}([^>]*)>${safeText}</${level}>`, "i");
        processed = processed.replace(regex, `<${level} id="${id}"$1>${text}</${level}>`);
    });
    return processed;
}

function applyDropCap(html: string): string {
    if (!html) return "";
    return html.replace(/<p>(.*?)<\/p>/i, (match: string, text: string) => {
        if (text.includes('<span class="drop-cap">')) return match;
        const firstChar = text.charAt(0);
        return `<p><span class="drop-cap">${firstChar}</span>${text.slice(1)}</p>`;
    });
}

function cleanContent(rawContent: string, title: string): string {
    let cleaned = sanitizeContent(rawContent, title);
    cleaned = processHeadings(cleaned);
    cleaned = applyDropCap(cleaned);
    return sanitizeContent(cleaned, title);
}

// ==========================================
// کامپوننت اصلی
// ==========================================
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
    const [showPreview, setShowPreview] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        const res = await fetch("/api/atelier-dashboard/journal");
        const json = await res.json();
        setItems(Array.isArray(json) ? json : json.data || []);
    }

    function handleCoverImage(e: any) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    async function uploadCoverImage() {
        if (!coverImage) return existingCoverId;
        const form = new FormData();
        form.append("file", coverImage);
        const res = await fetch("/api/atelier-dashboard/files/upload", { method: "POST", body: form });
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
        setTitleEn(""); setTitleFa(""); setSlug("");
        setExcerptEn(""); setExcerptFa("");
        setContentEn(""); setContentFa("");
        setCoverImage(null); setCoverPreview(null);
        setExistingCoverId(null); setEditingId(null);
        setError(""); setSuccess(""); setShowPreview(false);
    }

    // ==========================================
    // تنظیمات TipTap Editor
    // ==========================================
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: activeTab === "en" ? "Start writing your article here..." : "مقاله خود را اینجا بنویسید...",
            }),
        ],
        content: activeTab === "en" ? contentEn : contentFa,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (activeTab === "en") setContentEn(html);
            else setContentFa(html);
        },
    });

    // به‌روزرسانی محتوای ادیتور هنگام تغییر تب
    useEffect(() => {
        if (editor) {
            const currentContent = activeTab === "en" ? contentEn : contentFa;
            if (editor.getHTML() !== currentContent) {
                editor.commands.setContent(currentContent);
            }
        }
    }, [activeTab, contentEn, contentFa, editor]);

    // ==========================================
    // مدیریت آپلود عکس در TipTap
    // ==========================================
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/atelier-dashboard/files/upload", {
                method: "POST",
                body: formData,
            });
            const json = await res.json();

            if (json?.data?._id) {
                const imageUrl = urlFor({ _type: "image", asset: { _ref: json.data._id } }).url();
                const title = activeTab === "en" ? titleEn : titleFa;

                // درج عکس در محل نشانگر ماوس
                editor.chain().focus().setImage({
                    src: imageUrl,
                    alt: title || "Article image"
                }).run();
            }
        } catch (err) {
            console.error("Image upload failed", err);
            setError("Failed to upload image");
        }

        // ریست کردن input برای امکان آپلود مجدد همان فایل
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ==========================================
    // ذخیره مقاله
    // ==========================================
    async function saveArticle(isEdit = false) {
        if (!titleEn || !titleFa || !slug) {
            setError("Title EN, Title FA and Slug are required");
            return;
        }
        setError("");
        setLoading(true);

        let coverId = existingCoverId;
        if (coverImage) coverId = await uploadCoverImage();

        const url = isEdit && editingId ? `/api/atelier-dashboard/journal?id=${editingId}` : "/api/atelier-dashboard/journal";

        const finalContentEn = cleanContent(contentEn, titleEn);
        const finalContentFa = cleanContent(contentFa, titleFa);

        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title_en: titleEn,
                title_fa: titleFa,
                slug,
                excerpt_en: excerptEn,
                excerpt_fa: excerptFa,
                content_en: finalContentEn,
                content_fa: finalContentFa,
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
                setCoverPreview(urlFor(item.cover_image).width(400).url());
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
            const asset = typeof item.cover_image === "string"
                ? { _type: "image", asset: { _ref: item.cover_image } }
                : item.cover_image;
            return urlFor(asset).width(200).url();
        } catch {
            return null;
        }
    }

    // ==========================================
    // استایل‌های CSS اختصاصی TipTap
    // ==========================================
    const editorStyles = `
        .tiptap-wrapper {
            display: flex;
            flex-direction: column;
            height: 600px;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
        }
        .tiptap-toolbar {
            position: sticky;
            top: 0;
            z-index: 20;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            padding: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            flex-shrink: 0;
        }
        .tiptap-toolbar button {
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 14px;
            color: #374151;
            background: transparent;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tiptap-toolbar button:hover {
            background: #e5e7eb;
        }
        .tiptap-toolbar button.is-active {
            background: #D4AF37;
            color: #000;
            font-weight: 600;
        }
        .tiptap-toolbar .divider {
            width: 1px;
            background: #d1d5db;
            margin: 4px 8px;
        }
        .tiptap-editor {
            flex: 1;
            overflow-y: auto;
            padding: 32px;
            outline: none;
            font-size: 17px;
            line-height: 1.8;
            color: #111827;
        }
        .tiptap-editor[dir="rtl"] {
            direction: rtl;
            text-align: right;
        }
        .tiptap-editor p { margin-bottom: 1em; }
        .tiptap-editor h1, .tiptap-editor h2, .tiptap-editor h3, .tiptap-editor h4 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
            color: #000;
        }
        .tiptap-editor img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tiptap-editor img.ProseMirror-selectednode {
            outline: 3px solid #D4AF37;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        .tiptap-editor a {
            color: #D4AF37;
            text-decoration: underline;
        }
        .drop-cap::first-letter {
            float: left;
            font-size: 3.5em;
            line-height: 0.8;
            padding-right: 8px;
            padding-top: 4px;
            color: #D4AF37;
            font-weight: bold;
        }
        .tiptap-editor[dir="rtl"] .drop-cap::first-letter {
            float: right;
            padding-right: 0;
            padding-left: 8px;
        }
    `;

    // کامپوننت کمکی برای دکمه‌های تول‌بار
    const ToolbarButton = ({ onClick, isActive, children, title }: any) => (
        <button
            type="button"
            onClick={onClick}
            className={isActive ? "is-active" : ""}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20">
            <style>{editorStyles}</style>

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

                {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div>}
                {success && <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">{success}</div>}

                <div className="mb-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-light text-white">{editingId ? "Edit Article" : "New Article"}</h2>
                        {editingId && <button onClick={resetForm} className="text-sm text-[#a3a3a3] hover:text-white transition-colors">Cancel Edit</button>}
                    </div>

                    <div className="space-y-6">
                        {/* Titles */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Title (EN) *</label>
                                <input className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40" value={titleEn} onChange={(e) => handleTitleEn(e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Title (FA) *</label>
                                <input className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40" value={titleFa} onChange={(e) => setTitleFa(e.target.value)} dir="rtl" />
                            </div>
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Slug * (URL-friendly)</label>
                            <input className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} />
                        </div>

                        {/* Excerpts */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Excerpt (EN)</label>
                                <textarea className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40" value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Excerpt (FA)</label>
                                <textarea className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-[#a3a3a3] focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40" value={excerptFa} onChange={(e) => setExcerptFa(e.target.value)} dir="rtl" />
                            </div>
                        </div>

                        {/* TipTap Editor */}
                        <div>
                            <div className="mb-4 flex gap-4 border-b border-white/10">
                                <button onClick={() => setActiveTab("en")} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "en" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-[#a3a3a3] hover:text-white"}`}>English Content</button>
                                <button onClick={() => setActiveTab("fa")} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "fa" ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-[#a3a3a3] hover:text-white"}`}>فارسی</button>
                            </div>

                            <div dir={activeTab === "fa" ? "rtl" : "ltr"}>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                    Content ({activeTab === "en" ? "EN" : "FA"}) — Visual Editor
                                </label>

                                <div className="tiptap-wrapper">
                                    {/* Toolbar */}
                                    <div className="tiptap-toolbar">
                                        <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarButton>
                                        <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor?.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarButton>
                                        <div className="divider" />
                                        <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')} title="Bold"><b>B</b></ToolbarButton>
                                        <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')} title="Italic"><i>I</i></ToolbarButton>
                                        <ToolbarButton onClick={() => editor?.chain().focus().toggleStrike().run()} isActive={editor?.isActive('strike')} title="Strike"><s>S</s></ToolbarButton>
                                        <div className="divider" />
                                        <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive('bulletList')} title="Bullet List">• List</ToolbarButton>
                                        <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive('orderedList')} title="Ordered List">1. List</ToolbarButton>
                                        <div className="divider" />
                                        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} isActive={editor?.isActive({ textAlign: 'left' })} title="Align Left">Left</ToolbarButton>
                                        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} isActive={editor?.isActive({ textAlign: 'center' })} title="Align Center">Center</ToolbarButton>
                                        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} isActive={editor?.isActive({ textAlign: 'right' })} title="Align Right">Right</ToolbarButton>
                                        <div className="divider" />
                                        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload Image">📷 Image</ToolbarButton>
                                        <ToolbarButton onClick={() => {
                                            const url = window.prompt('Enter URL:');
                                            if (url) editor?.chain().focus().setLink({ href: url }).run();
                                        }} isActive={editor?.isActive('link')} title="Add Link">🔗 Link</ToolbarButton>
                                        <ToolbarButton onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">✖ Clear</ToolbarButton>
                                    </div>

                                    {/* Hidden File Input for Image Upload */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    {/* Editor Content Area */}
                                    <EditorContent editor={editor} className="tiptap-editor" />
                                </div>
                                <p className="mt-2 text-xs text-[#a3a3a3]">
                                    💡 برای آپلود عکس روی دکمه 📷 کلیک کنید. برای تغییر موقعیت عکس، روی آن کلیک کنید تا طلایی شود، سپس دکمه‌های Left/Center/Right را بزنید.
                                </p>
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Cover Image</label>
                            <div className="flex items-start gap-6">
                                <div className="flex-1">
                                    <input type="file" accept="image/*" onChange={handleCoverImage} className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-[#D4AF37] file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-[#FFE8A3]" />
                                </div>
                                {coverPreview && (
                                    <div className="relative">
                                        <img src={coverPreview} alt="Preview" className="h-32 w-48 rounded-xl border border-white/10 object-cover" />
                                        <button onClick={() => { setCoverImage(null); setCoverPreview(null); if (!editingId) setExistingCoverId(null); }} className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600">×</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => setShowPreview(true)} disabled={!titleEn && !titleFa} className="rounded-xl border border-[#D4AF37]/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-50">👁 Preview</button>
                            <button onClick={() => saveArticle(!!editingId)} disabled={loading} className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#8B7332] px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black transition-all hover:from-[#FFE8A3] hover:to-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50">
                                {loading ? "Saving..." : editingId ? "Update Article" : "Create Article"}
                            </button>
                            {editingId && <button onClick={resetForm} className="rounded-xl border border-white/20 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all hover:border-white/40">Cancel</button>}
                        </div>
                    </div>
                </div>

                {/* Articles List */}
                <div>
                    <h2 className="mb-6 text-xl font-light text-white">Articles ({items.length})</h2>
                    {items.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
                            <p className="text-[#a3a3a3]">No articles yet. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const imgUrl = getImageUrl(item);
                                return (
                                    <div key={item._id} className="group flex items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-[#D4AF37]/30 hover:bg-white/[0.04]">
                                        {imgUrl ? <img src={imgUrl} alt={item.title_en} className="h-20 w-32 rounded-xl object-cover" /> : <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-xs text-[#a3a3a3]">No Image</div>}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="truncate text-lg font-light text-white group-hover:text-[#FFE8A3] transition-colors">{item.title_en}</h3>
                                            <p className="text-sm text-[#a3a3a3]" dir="rtl">{item.title_fa}</p>
                                            <p className="mt-1 text-xs font-mono text-[#D4AF37]">/journal/{item.slug?.current || item.slug}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => editArticle(item)} className="rounded-lg border border-[#D4AF37]/30 px-4 py-2 text-xs font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10">Edit</button>
                                            <a href={`/en/journal/${item.slug?.current || item.slug}`} target="_blank" rel="noreferrer" className="rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-white transition-all hover:border-white/40">View →</a>
                                            <button onClick={() => deleteArticle(item._id)} className="rounded-lg px-4 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/10">Delete</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal (بدون تغییر در منطق، فقط استفاده از توابع sanitize) */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
                    <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#070707] shadow-2xl">
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#070707]/95 px-8 py-4 backdrop-blur-sm">
                            <h3 className="text-lg font-light text-white">Article Preview</h3>
                            <button onClick={() => setShowPreview(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white/5">✖</button>
                        </div>
                        <div className="p-8 md:p-12">
                            <h1 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent">{titleEn || titleFa || "Article Title"}</span>
                            </h1>
                            {coverPreview && (
                                <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10">
                                    <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                                </div>
                            )}
                            <div className={`preview-prose mt-12 ${activeTab === "fa" ? "text-right" : "text-left"}`} dir={activeTab === "fa" ? "rtl" : "ltr"} dangerouslySetInnerHTML={{
                                __html: (() => {
                                    const rawContent = activeTab === "en" ? contentEn : contentFa;
                                    if (!rawContent) return "<p style='color:#a3a3a3; text-align:center; padding:3rem 0;'>No content yet.</p>";
                                    return applyDropCap(processHeadings(sanitizeContent(rawContent, activeTab === "en" ? titleEn : titleFa)));
                                })()
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}