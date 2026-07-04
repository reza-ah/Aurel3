"use client";

import { useEffect, useState } from "react";
import { urlFor } from "@/lib/sanity";

export default function JournalManager() {
    const [items, setItems] = useState<any[]>([]);
    const [titleEn, setTitleEn] = useState("");
    const [titleFa, setTitleFa] = useState("");
    const [slug, setSlug] = useState("");
    const [excerptEn, setExcerptEn] = useState("");
    const [excerptFa, setExcerptFa] = useState("");
    const [contentEn, setContentEn] = useState("");
    const [contentFa, setContentFa] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        const res = await fetch("/api/atelier-dashboard/journal");
        const json = await res.json();
        // ✅ اصلاح: Sanity از data استفاده نمی‌کند، مستقیم آرایه است
        setItems(Array.isArray(json) ? json : json.data || []);
    }

    function handleImage(e: any) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    async function uploadImage() {
        if (!coverImage) return null;
        const form = new FormData();
        form.append("file", coverImage);

        // ✅ اصلاح: استفاده از endpoint عمومی آپلود Sanity
        const res = await fetch("/api/atelier-dashboard/files/upload", {
            method: "POST",
            body: form,
        });
        const json = await res.json();

        // ✅ اصلاح: Sanity از _id استفاده می‌کند
        return json?.data?._id ?? null;
    }

    // اتوماتیک slug از title انگلیسی
    function handleTitleEn(val: string) {
        setTitleEn(val);
        if (!slug) {
            setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
        }
    }

    async function createArticle() {
        if (!titleEn || !titleFa || !slug) {
            setError("Title EN, Title FA and Slug are required");
            return;
        }
        setError("");
        setLoading(true);

        let coverId = null;
        if (coverImage) {
            coverId = await uploadImage();
        }

        const res = await fetch("/api/atelier-dashboard/journal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title_en: titleEn,
                title_fa: titleFa,
                slug,
                excerpt_en: excerptEn,
                excerpt_fa: excerptFa,
                content_en: contentEn,
                content_fa: contentFa,
                // ✅ اصلاح: ساختار Sanity برای تصویر
                cover_image: coverId ? { _type: "image", asset: { _ref: coverId } } : null,
                status: "published",
            }),
        });

        setLoading(false);

        if (res.ok) {
            setSuccess("Article created successfully!");
            setTitleEn("");
            setTitleFa("");
            setSlug("");
            setExcerptEn("");
            setExcerptFa("");
            setContentEn("");
            setContentFa("");
            setCoverImage(null);
            setCoverPreview(null);
            setTimeout(() => setSuccess(""), 3000);
            fetchItems();
        } else {
            setError("Failed to create article");
        }
    }

    async function deleteArticle(id: string) {
        if (!confirm("Delete this article?")) return;
        // ✅ اصلاح: Sanity از _id استفاده می‌کند
        await fetch(`/api/atelier-dashboard/journal?id=${id}`, { method: "DELETE" });
        fetchItems();
    }

    // ✅ اصلاح: استفاده از urlFor برای Sanity
    function getImageUrl(item: any) {
        if (!item.cover_image) return null;

        try {
            // اگر cover_image یک object با asset باشد
            if (item.cover_image.asset) {
                return urlFor(item.cover_image).width(200).url();
            }

            // اگر cover_image یک string (reference ID) باشد
            if (typeof item.cover_image === "string") {
                return urlFor({ _type: "image", asset: { _ref: item.cover_image } }).width(200).url();
            }

            return null;
        } catch {
            return null;
        }
    }

    return (
        <main className="pt-32 px-10 text-white pb-32 max-w-5xl">
            <h1 className="text-3xl mb-10 font-light tracking-wide">Journal Manager</h1>

            {/* FORM */}
            <div className="bg-zinc-900 p-6 rounded-xl mb-10 space-y-4">
                <h2 className="text-lg font-medium mb-2">New Article</h2>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && <p className="text-emerald-400 text-sm">{success}</p>}

                <div className="flex gap-5">
                    <div className="flex-1">
                        <label className="text-xs text-[#a3a3a3] mb-1 block">Title (EN) *</label>
                        <input
                            className="w-full p-2 bg-zinc-800 rounded"
                            placeholder="Article title in English"
                            value={titleEn}
                            onChange={(e) => handleTitleEn(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-[#a3a3a3] mb-1 block">Title (FA) *</label>
                        <input
                            className="w-full p-2 bg-zinc-800 rounded"
                            placeholder="عنوان مقاله به فارسی"
                            value={titleFa}
                            onChange={(e) => setTitleFa(e.target.value)}
                            dir="rtl"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-[#a3a3a3] mb-1 block">
                        Slug * (no spaces, English only)
                    </label>
                    <input
                        className="w-full p-2 bg-zinc-800 rounded font-mono text-sm"
                        placeholder="my-article-slug"
                        value={slug}
                        onChange={(e) =>
                            setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
                        }
                    />
                </div>

                <div className="flex gap-5">
                    <div className="flex-1">
                        <label className="text-xs text-[#a3a3a3] mb-1 block">Excerpt (EN)</label>
                        <textarea
                            className="w-full p-2 bg-zinc-800 rounded h-20 resize-none"
                            placeholder="Short description in English"
                            value={excerptEn}
                            onChange={(e) => setExcerptEn(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-[#a3a3a3] mb-1 block">Excerpt (FA)</label>
                        <textarea
                            className="w-full p-2 bg-zinc-800 rounded h-20 resize-none"
                            placeholder="توضیح کوتاه به فارسی"
                            value={excerptFa}
                            onChange={(e) => setExcerptFa(e.target.value)}
                            dir="rtl"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-[#a3a3a3] mb-1 block">Content (EN) — HTML allowed</label>
                    <textarea
                        className="w-full p-2 bg-zinc-800 rounded h-48 resize-y font-mono text-sm"
                        placeholder="<p>Article content in English...</p>"
                        value={contentEn}
                        onChange={(e) => setContentEn(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs text-[#a3a3a3] mb-1 block">Content (FA) — HTML allowed</label>
                    <textarea
                        className="w-full p-2 bg-zinc-800 rounded h-48 resize-y font-mono text-sm"
                        placeholder="<p>محتوای مقاله به فارسی...</p>"
                        value={contentFa}
                        onChange={(e) => setContentFa(e.target.value)}
                        dir="rtl"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-[#a3a3a3] block">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="w-full bg-zinc-800 p-2 rounded text-sm"
                    />
                    {coverPreview && (
                        <div className="relative w-40">
                            <img
                                src={coverPreview}
                                className="w-40 h-40 object-cover rounded border border-zinc-700"
                            />
                            <button
                                onClick={() => {
                                    setCoverImage(null);
                                    setCoverPreview(null);
                                }}
                                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={createArticle}
                    disabled={loading}
                    className="bg-emerald-500 disabled:bg-emerald-800 text-black px-8 py-2.5 rounded-lg font-medium transition-colors hover:bg-emerald-400"
                >
                    {loading ? "Creating..." : "Create Article"}
                </button>
            </div>

            {/* LIST */}
            <h2 className="text-xl mb-4 font-light">Articles ({items.length})</h2>

            <div className="space-y-3">
                {items.length === 0 && <p className="text-zinc-500 text-sm">No articles yet.</p>}
                {items.map((item) => {
                    const imgUrl = getImageUrl(item);
                    return (
                        <div
                            key={item._id}
                            className="border border-zinc-700 p-4 rounded-lg flex justify-between items-center hover:border-zinc-500 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {imgUrl ? (
                                    <img
                                        src={imgUrl}
                                        alt={item.title_en}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-zinc-800 rounded flex items-center justify-center text-zinc-600 text-xs">
                                        No img
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium">{item.title_en}</div>
                                    <div className="text-sm text-[#a3a3a3]" dir="rtl">
                                        {item.title_fa}
                                    </div>
                                    <div className="text-xs text-zinc-600 mt-1 font-mono">
                                        /journal/{item.slug?.current || item.slug}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={`/en/journal/${item.slug?.current || item.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    View →
                                </a>
                                <button
                                    onClick={() => deleteArticle(item._id)}
                                    className="text-red-400 hover:text-red-200 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}