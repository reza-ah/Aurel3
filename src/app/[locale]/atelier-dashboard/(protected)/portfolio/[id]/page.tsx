"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { urlFor } from "@/lib/sanity";

type SanityImage = {
    _type: "image";
    asset?: {
        _ref: string;
        _type: "reference";
    };
};

type SanityReference = {
    _type: "reference";
    _ref: string;
};

type PortfolioItem = {
    _id: string;
    title_en?: string;
    title_fa?: string;
    slug?: { current: string } | string;
    category_fa?: string;
    category_en?: string;
    description_fa?: string;
    description_en?: string;
    featured?: boolean;
    status?: string;
    cover_image?: SanityImage | string;
    gallery?: (SanityImage | string)[];
    tags?: SanityReference[];
    // ✅ فیلدهای جدید برای مشخصات محصول
    material_fa?: string;
    material_en?: string;
    weight_fa?: string;
    weight_en?: string;
    dimensions_fa?: string;
    dimensions_en?: string;
    production_time_fa?: string;
    production_time_en?: string;
};

type TagItem = {
    _id: string;
    name_fa?: string;
    name_en?: string;
};

type GalleryDraftItem =
    | SanityImage
    | string
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

function getImageUrl(image: SanityImage | string | null | undefined): string | null {
    if (!image) return null;

    try {
        if (typeof image === "string") {
            return urlFor({ _type: "image", asset: { _ref: image } }).width(200).url();
        }

        if (image.asset) {
            return urlFor(image).width(200).url();
        }

        return null;
    } catch {
        return null;
    }
}

function getSlug(slug: { current: string } | string | undefined): string {
    if (!slug) return "";
    if (typeof slug === "string") return slug;
    return slug.current || "";
}

function normalizeTagIds(input: SanityReference[] | null | undefined): string[] {
    if (!input || !Array.isArray(input)) return [];
    return input
        .map((t) => {
            if (typeof t === "string") return t;
            if (t?._ref) return t._ref;
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
        status: "published",
        cover_image: null as SanityImage | string | null,
        // ✅ فیلدهای جدید
        material_fa: "",
        material_en: "",
        weight_fa: "",
        weight_en: "",
        dimensions_fa: "",
        dimensions_en: "",
        production_time_fa: "",
        production_time_en: "",
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
                slug: getSlug(current?.slug),
                category_fa: current?.category_fa || "",
                category_en: current?.category_en || "",
                description_fa: current?.description_fa || "",
                description_en: current?.description_en || "",
                featured: !!current?.featured,
                status: current?.status || "published",
                cover_image: current?.cover_image || null,
                // ✅ بارگذاری فیلدهای جدید
                material_fa: current?.material_fa || "",
                material_en: current?.material_en || "",
                weight_fa: current?.weight_fa || "",
                weight_en: current?.weight_en || "",
                dimensions_fa: current?.dimensions_fa || "",
                dimensions_en: current?.dimensions_en || "",
                production_time_fa: current?.production_time_fa || "",
                production_time_en: current?.production_time_en || "",
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
        const fileId = json?.data?._id || json?._id;

        if (!res.ok || !fileId) throw new Error(json?.message || "Upload failed");
        return fileId;
    }

    async function handleSave() {
        if (!id) return;

        try {
            setSaving(true);

            let coverId: string | null = null;
            if (typeof form.cover_image === "string") {
                coverId = form.cover_image;
            } else if (form.cover_image?.asset?._ref) {
                coverId = form.cover_image.asset._ref;
            }

            if (editCover) {
                coverId = await uploadFile(editCover);
            }

            const galleryRefs: string[] = [];
            for (const img of editGallery) {
                if (typeof img === "object" && "preview" in img && img.preview) {
                    const uploadedId = await uploadFile(img.file);
                    galleryRefs.push(uploadedId);
                } else if (typeof img === "string") {
                    galleryRefs.push(img);
                } else if ("asset" in img && img.asset?._ref) {
                    galleryRefs.push(img.asset._ref);
                }
            }

            const payload = {
                title_en: form.title_en,
                title_fa: form.title_fa,
                slug: { current: form.slug },
                category_fa: form.category_fa,
                category_en: form.category_en,
                description_fa: form.description_fa,
                description_en: form.description_en,
                featured: form.featured,
                status: form.status,
                cover_image: coverId ? { _type: "image", asset: { _ref: coverId } } : null,
                gallery: galleryRefs.map(ref => ({ _type: "image", asset: { _ref: ref } })),
                tags: editSelectedTags.map(tagId => ({ _type: "reference", _ref: tagId })),
                // ✅ اضافه کردن فیلدهای جدید به payload
                material_fa: form.material_fa || null,
                material_en: form.material_en || null,
                weight_fa: form.weight_fa || null,
                weight_en: form.weight_en || null,
                dimensions_fa: form.dimensions_fa || null,
                dimensions_en: form.dimensions_en || null,
                production_time_fa: form.production_time_fa || null,
                production_time_en: form.production_time_en || null,
            };

            const apiUrl = isNew
                ? "/api/atelier-dashboard/portfolio"
                : `/api/atelier-dashboard/portfolio/${id}`;

            const apiMethod = isNew ? "POST" : "PATCH";

            const res = await fetch(apiUrl, {
                method: apiMethod,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
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
                    <p className="text-sm text-[#a3a3a3] mt-1">
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
                    <label className="text-sm text-[#a3a3a3]">Title (English)</label>
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

                    <label className="text-sm text-[#a3a3a3]">عنوان (فارسی)</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.title_fa}
                        onChange={(e) => setForm((prev) => ({ ...prev, title_fa: e.target.value }))}
                    />

                    <label className="text-sm text-[#a3a3a3]">Slug</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    />

                    <label className="text-sm text-[#a3a3a3]">Category (فارسی)</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.category_fa}
                        onChange={(e) => setForm((prev) => ({ ...prev, category_fa: e.target.value }))}
                    />

                    <label className="text-sm text-[#a3a3a3]">Category (English)</label>
                    <input
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        value={form.category_en}
                        onChange={(e) => setForm((prev) => ({ ...prev, category_en: e.target.value }))}
                    />

                    <label className="text-sm text-[#a3a3a3]">Description (فارسی)</label>
                    <textarea
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        rows={4}
                        value={form.description_fa}
                        onChange={(e) => setForm((prev) => ({ ...prev, description_fa: e.target.value }))}
                    />

                    <label className="text-sm text-[#a3a3a3]">Description (English)</label>
                    <textarea
                        className="w-full p-2 rounded-lg bg-zinc-800"
                        rows={4}
                        value={form.description_en}
                        onChange={(e) => setForm((prev) => ({ ...prev, description_en: e.target.value }))}
                    />

                    {/* ✅ بخش جدید: مشخصات محصول */}
                    <div className="border-t border-zinc-700 pt-4 mt-2">
                        <h3 className="text-lg font-semibold mb-3 text-[#D4AF37]">مشخصات محصول</h3>
                        <p className="text-xs text-[#a3a3a3] mb-4">این فیلدها اختیاری هستند و فقط در صورت پر شدن نمایش داده می‌شوند</p>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-[#a3a3a3]">Material (فارسی)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="مثلاً: طلای 18 عیار"
                                    value={form.material_fa}
                                    onChange={(e) => setForm((prev) => ({ ...prev, material_fa: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[#a3a3a3]">Material (English)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="e.g., 18K Gold"
                                    value={form.material_en}
                                    onChange={(e) => setForm((prev) => ({ ...prev, material_en: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-[#a3a3a3]">Weight (فارسی)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="مثلاً: حدود 10 گرم"
                                    value={form.weight_fa}
                                    onChange={(e) => setForm((prev) => ({ ...prev, weight_fa: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[#a3a3a3]">Weight (English)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="e.g., Approx. 10g"
                                    value={form.weight_en}
                                    onChange={(e) => setForm((prev) => ({ ...prev, weight_en: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-[#a3a3a3]">Dimensions (فارسی)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="مثلاً: قابل سفارشی‌سازی"
                                    value={form.dimensions_fa}
                                    onChange={(e) => setForm((prev) => ({ ...prev, dimensions_fa: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[#a3a3a3]">Dimensions (English)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="e.g., Customizable"
                                    value={form.dimensions_en}
                                    onChange={(e) => setForm((prev) => ({ ...prev, dimensions_en: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-[#a3a3a3]">Production Time (فارسی)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="مثلاً: 10-14 روز کاری"
                                    value={form.production_time_fa}
                                    onChange={(e) => setForm((prev) => ({ ...prev, production_time_fa: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[#a3a3a3]">Production Time (English)</label>
                                <input
                                    className="w-full p-2 rounded-lg bg-zinc-800"
                                    placeholder="e.g., 10-14 business days"
                                    value={form.production_time_en}
                                    onChange={(e) => setForm((prev) => ({ ...prev, production_time_en: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-1.5">
                        <label className="text-sm text-[#a3a3a3]">Status (وضعیت انتشار)</label>
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
                        <label htmlFor="edit-featured" className="text-sm text-[#a3a3a3]">
                            Featured
                        </label>
                    </div>
                </div>

                <div>
                    <label className="text-sm text-[#a3a3a3] block mb-2">Tags</label>
                    <select
                        multiple
                        className="w-full p-2 rounded-lg bg-zinc-800 text-sm"
                        value={editSelectedTags}
                        onChange={(e) =>
                            setEditSelectedTags(Array.from(e.target.selectedOptions).map((o) => o.value))
                        }
                    >
                        {tags.map((t) => (
                            <option key={t._id} value={t._id}>
                                {t.name_fa || t.name_en || t._id}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm text-[#a3a3a3] block mb-2">Gallery</label>
                    <div className="grid grid-cols-4 gap-2">
                        {editGallery.map((img, i) => {
                            let srcUrl: string | null = null;

                            if (typeof img === "object" && "preview" in img && img.preview) {
                                srcUrl = img.id;
                            } else {
                                srcUrl = getImageUrl(img as SanityImage | string);
                            }

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
                    <label className="text-sm text-[#a3a3a3] block mb-2">Cover Image</label>
                    {!editCover && form.cover_image && (() => {
                        const coverUrl = getImageUrl(form.cover_image);
                        return coverUrl ? (
                            <div className="mb-2">
                                <p className="text-xs text-zinc-500 mb-1">Current cover:</p>
                                <img
                                    src={coverUrl}
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
                        className="px-4 py-2 rounded-lg text-[#a3a3a3] hover:text-white"
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