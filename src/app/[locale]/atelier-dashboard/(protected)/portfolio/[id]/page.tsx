"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/+$/, "");

type DirectusFileRef =
    | string
    | {
        id?: string;
        directus_files_id?: string | { id?: string };
    };

type DirectusTagRef =
    | string
    | number
    | {
        id?: string | number;
        portfolio_tags_id?: { id?: string | number };
    };

type PortfolioItem = {
    id: string;
    title_en?: string;
    title_fa?: string;
    slug?: string;
    category_fa?: string;
    category_en?: string;
    description_fa?: string;
    description_en?: string;
    featured?: boolean;
    status?: string; // 👈 اضافه شدن در تایپ‌ها
    cover_image?: DirectusFileRef;
    gallery?: DirectusFileRef[];
    tags?: DirectusTagRef[];
};

type TagItem = {
    id: string;
    name_fa?: string;
    name_en?: string;
};

type GalleryDraftItem =
    | DirectusFileRef
    | {
        id: string;
        preview: true;
        file: File;
    };

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function resolveFileId(file: DirectusFileRef | null | undefined): string | null {
    if (!file) return null;
    if (typeof file === "string") return file;
    if (file.directus_files_id) {
        if (typeof file.directus_files_id === "string") return file.directus_files_id;
        if (file.directus_files_id.id) return file.directus_files_id.id;
    }
    if (file.id) return file.id;
    return null;
}

function normalizeTagIds(input: DirectusTagRef[] | null | undefined): string[] {
    if (!input || !Array.isArray(input)) return [];
    return input
        .map((t) => {
            if (typeof t === "string") return t;
            if (typeof t === "number") return t.toString();
            if (t?.id) return t.id.toString();
            if (t?.portfolio_tags_id?.id) return t.portfolio_tags_id.id.toString();
            return null;
        })
        .filter(Boolean) as string[];
}

export default function PortfolioEditPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const isNew = id === "new" || id === "create";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tags, setTags] = useState<TagItem[]>([]);
    const [editCover, setEditCover] = useState<File | null>(null);
    const [editGallery, setEditGallery] = useState<GalleryDraftItem[]>([]);
    const [editSelectedTags, setEditSelectedTags] = useState<string[]>([]);

    const [form, setForm] = useState({
        title_en: "",
        title_fa: "",
        slug: "",
        category_fa: "",
        category_en: "",
        description_fa: "",
        description_en: "",
        featured: false,
        status: "published", // 👈 ۱. مقدار پیش‌فرض فیلد وضعیت برای آیتم‌های جدید
        cover_image: null as DirectusFileRef | null,
    });

    useEffect(() => {
        if (!id) return;

        if (isNew) {
            fetchTags();
            setLoading(false);
            return;
        }

        fetchItem(id);
        fetchTags();
    }, [id, isNew]);

    async function fetchItem(itemId: string) {
        try {
            setLoading(true);
            const res = await fetch(`/api/atelier-dashboard/portfolio/${itemId}?_t=${Date.now()}`, {
                cache: 'no-store'
            });

            if (!res.ok) throw new Error("Failed to fetch item");
            const json = await res.json();
            const data = json.data || json;
            const current = Array.isArray(data) ? data[0] : data;

            setForm({
                title_en: current?.title_en || "",
                title_fa: current?.title_fa || "",
                slug: current?.slug || "",
                category_fa: current?.category_fa || "",
                category_en: current?.category_en || "",
                description_fa: current?.description_fa || "",
                description_en: current?.description_en || "",
                featured: !!current?.featured,
                status: current?.status || "published", // 👈 ۲. لود کردن وضعیت از دایرکتوس هنگام ادیت
                cover_image: current?.cover_image || null,
            });

            setEditGallery(current?.gallery || []);
            setEditSelectedTags(normalizeTagIds(current?.tags));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchTags() {
        try {
            const res = await fetch("/api/atelier-dashboard/portfolio_tags");
            if (!res.ok) throw new Error("Failed to fetch tags");
            const json = await res.json();
            const data = json.data || json;
            setTags(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setTags([]);
        }
    }

    async function uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/atelier-dashboard/files/upload", {
            method: "POST",
            body: formData,
        });

        const json = await res.json().catch(() => null);
        const fileId = json?.data?.id || json?.id;

        if (!res.ok || !fileId) throw new Error(json?.message || "Upload failed");
        return fileId;
    }

    async function handleSave() {
        if (!id) return;

        try {
            setSaving(true);

            let coverId = resolveFileId(form.cover_image);
            if (editCover) coverId = await uploadFile(editCover);

            const galleryIds: string[] = [];
            for (const img of editGallery) {
                if (typeof img === "object" && "preview" in img && img.preview) {
                    galleryIds.push(await uploadFile(img.file));
                } else {
                    const fileId = resolveFileId(img as DirectusFileRef);
                    if (fileId) galleryIds.push(fileId);
                }
            }

            const payload = {
                title_en: form.title_en,
                title_fa: form.title_fa,
                slug: form.slug,
                category_fa: form.category_fa,
                category_en: form.category_en,
                description_fa: form.description_fa,
                description_en: form.description_en,
                featured: form.featured,
                status: form.status, // 👈 ۳. ارسال وضعیت انتخاب شده به بک‌اند
                cover_image: coverId,
                gallery: galleryIds,
                tags: editSelectedTags,
            };

            const apiUrl = isNew
                ? "/api/atelier-dashboard/portfolio"
                : `/api/atelier-dashboard/portfolio/${id}`;

            const apiMethod = isNew ? "POST" : "PATCH";

            const res = await fetch(apiUrl, {
                method: apiMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Save failed");
            }

            router.refresh();
            router.push("/en/atelier-dashboard/portfolio");
        } catch (error) {
            console.error(error);
            alert("Save failed");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="pt-28 px-8 text-white">
                <p>در حال بارگذاری...</p>
            </main>
        );
    }

    return (
        <main className="pt-28 px-8 text-white">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">
                        {isNew ? "Add New Portfolio" : "Edit Portfolio"}
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        {isNew ? "ایجاد آیتم جدید" : "ویرایش آیتم"}
                    </p>
                </div>

                <Link
                    href="/en/atelier-dashboard/portfolio"
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition"
                >
                    ← Back to List
                </Link>
            </div>

            <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="grid gap-3">
                    <label className="text-sm text-zinc-400">Title (English)</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.title_en}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                title_en: e.target.value,
                                slug: slugify(e.target.value),
                            }))
                        }
                    />

                    <label className="text-sm text-zinc-400">عنوان (فارسی)</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.title_fa}
                        onChange={(e) => setForm((prev) => ({ ...prev, title_fa: e.target.value }))}
                    />

                    <label className="text-sm text-zinc-400">Slug</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    />

                    <label className="text-sm text-zinc-400">Category (فارسی)</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.category_fa}
                        onChange={(e) => setForm((prev) => ({ ...prev, category_fa: e.target.value }))}
                    />

                    <label className="text-sm text-zinc-400">Category (English)</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.category_en}
                        onChange={(e) => setForm((prev) => ({ ...prev, category_en: e.target.value }))}
                    />

                    <label className="text-sm text-zinc-400">Description (فارسی)</label>
                    <textarea
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        rows={4}
                        value={form.description_fa}
                        onChange={(e) => setForm((prev) => ({ ...prev, description_fa: e.target.value }))}
                    />

                    <label className="text-sm text-zinc-400">Description (English)</label>
                    <textarea
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        rows={4}
                        value={form.description_en}
                        onChange={(e) => setForm((prev) => ({ ...prev, description_en: e.target.value }))}
                    />

                    {/* 👈 ۴. المان سلکتور انتخاب وضعیت (Status Dropdown) اضافه شده */}
                    <div className="grid gap-1.5">
                        <label className="text-sm text-zinc-400">Status (وضعیت انتشار)</label>
                        <select
                            className="w-full p-2.5 rounded-lg bg-zinc-800 text-sm text-white border border-transparent focus:border-zinc-700 outline-none"
                            value={form.status}
                            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="published">Published (منتشر شده)</option>
                            <option value="draft">Draft (پیش‌نویس)</option>
                            <option value="archived">Archived (آرشیو شده)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            id="edit-featured"
                            type="checkbox"
                            className="accent-blue-500"
                            checked={form.featured}
                            onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                        />
                        <label htmlFor="edit-featured" className="text-sm text-zinc-400">
                            Featured
                        </label>
                    </div>
                </div>

                <div>
                    <label className="text-sm text-zinc-400 block mb-2">Tags</label>
                    <select
                        multiple
                        className="w-full p-2 rounded-lg bg-zinc-800 text-sm"
                        value={editSelectedTags}
                        onChange={(e) =>
                            setEditSelectedTags(Array.from(e.target.selectedOptions).map((o) => o.value))
                        }
                    >
                        {tags.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name_fa || t.name_en || t.id}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm text-zinc-400 block mb-2">Gallery</label>
                    <div className="grid grid-cols-4 gap-2">
                        {editGallery.map((img, i) => {
                            const srcUrl =
                                typeof img === "object" && "preview" in img && img.preview
                                    ? img.id
                                    : `${DIRECTUS_URL}/assets/${resolveFileId(img as DirectusFileRef)}`;

                            if (!srcUrl) return null;

                            return (
                                <div key={i} className="relative">
                                    <img src={srcUrl} className="w-full h-20 object-cover rounded-lg" alt="Gallery" />
                                    <button
                                        type="button"
                                        onClick={() => setEditGallery((prev) => prev.filter((_, index) => index !== i))}
                                        className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <input
                        type="file"
                        multiple
                        className="mt-3 text-sm"
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const previews = files.map((file) => ({
                                id: URL.createObjectURL(file),
                                preview: true as const,
                                file,
                            }));
                            setEditGallery((prev) => [...prev, ...previews]);
                        }}
                    />
                </div>

                <div>
                    <label className="text-sm text-zinc-400 block mb-2">Cover Image</label>
                    {/* نمایش cover فعلی */}
                    {!editCover && form.cover_image && (() => {
                        const coverId = resolveFileId(form.cover_image);
                        return coverId ? (
                            <div className="mb-2">
                                <p className="text-xs text-zinc-500 mb-1">Current cover:</p>
                                <img
                                    src={`${DIRECTUS_URL}/assets/${coverId}`}
                                    className="w-32 h-32 object-cover rounded-lg border border-zinc-700"
                                    alt="Current cover"
                                />
                            </div>
                        ) : null;
                    })()}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditCover(e.target.files?.[0] || null)}
                    />
                    {editCover && (
                        <div className="mt-2">
                            <p className="text-xs text-zinc-500 mb-1">New cover preview:</p>
                            <img
                                src={URL.createObjectURL(editCover)}
                                className="w-32 h-32 object-cover rounded-lg border border-zinc-700"
                                alt="New cover"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/en/atelier-dashboard/portfolio"
                        className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:brightness-110 disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </main>
    );
}