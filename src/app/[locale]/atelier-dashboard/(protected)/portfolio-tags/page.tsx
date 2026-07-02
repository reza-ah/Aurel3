"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PortfolioTag {
    _id: string;
    name_en: string;
    name_fa: string;
    sort: number;
    is_active: boolean;
}

export default function PortfolioTagsPage() {
    const [tags, setTags] = useState<PortfolioTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTag, setEditingTag] = useState<PortfolioTag | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const pathname = usePathname();
    const locale = pathname?.split("/")?.[1] || "en";

    useEffect(() => {
        fetchTags();
    }, []);

    async function fetchTags() {
        try {
            const res = await fetch("/api/atelier-dashboard/portfolio_tags", {
                credentials: "include",
            });
            const data = await res.json();
            setTags(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch tags:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(newTag: { name_en: string; name_fa: string; sort: number }) {
        try {
            const res = await fetch("/api/atelier-dashboard/portfolio_tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newTag),
            });

            if (res.ok) {
                setShowAddForm(false);
                fetchTags();
            }
        } catch (error) {
            console.error("Failed to add tag:", error);
        }
    }

    // ✅ اصلاح: تابع جداگانه برای edit
    async function handleUpdate(data: { name_en: string; name_fa: string; sort: number; is_active?: boolean }) {
        if (!editingTag) return;

        try {
            const res = await fetch("/api/atelier-dashboard/portfolio_tags", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    _id: editingTag._id,
                    ...data,
                }),
            });

            if (res.ok) {
                setEditingTag(null);
                fetchTags();
            }
        } catch (error) {
            console.error("Failed to update tag:", error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this tag?")) return;

        try {
            const res = await fetch(`/api/atelier-dashboard/portfolio_tags?id=${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                fetchTags();
            }
        } catch (error) {
            console.error("Failed to delete tag:", error);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white pt-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse text-zinc-500">Loading...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-32 px-6 pb-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-sm tracking-[0.3em] uppercase text-zinc-500 mb-3">
                            Atelier Dashboard
                        </p>
                        <h1 className="text-4xl md:text-5xl font-light">Portfolio Tags</h1>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="border border-zinc-700 hover:border-[#D4AF37] px-6 py-3 rounded-full text-sm transition-colors hover:text-[#D4AF37]"
                    >
                        + Add Tag
                    </button>
                </div>

                {/* Add Form Modal */}
                {showAddForm && (
                    <TagForm
                        mode="add"
                        onSubmit={handleAdd}
                        onCancel={() => setShowAddForm(false)}
                    />
                )}

                {/* Edit Form Modal */}
                {editingTag && (
                    <TagForm
                        mode="edit"
                        tag={editingTag}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingTag(null)}
                    />
                )}

                {/* Tags List */}
                <div className="space-y-4">
                    {tags.map((tag) => (
                        <div
                            key={tag._id}
                            className="border border-zinc-800 bg-zinc-950/70 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-xl font-light">{tag.name_en}</h3>
                                        <span className="text-sm text-zinc-500">{tag.name_fa}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                                        <span>Sort: {tag.sort}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${tag.is_active
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-zinc-800 text-zinc-500"
                                            }`}>
                                            {tag.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingTag(tag)}
                                        className="border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tag._id)}
                                        className="border border-red-900/50 hover:border-red-700 text-red-400 hover:text-red-300 px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {tags.length === 0 && (
                        <div className="border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
                            No tags found. Click "Add Tag" to create one.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

// Tag Form Component
function TagForm({
    mode,
    tag,
    onSubmit,
    onCancel,
}: {
    mode: "add" | "edit";
    tag?: PortfolioTag;
    onSubmit: (data: { name_en: string; name_fa: string; sort: number; is_active?: boolean }) => void;
    onCancel: () => void;
}) {
    const [name_en, setName_en] = useState(tag?.name_en || "");
    const [name_fa, setName_fa] = useState(tag?.name_fa || "");
    const [sort, setSort] = useState(tag?.sort || 999);
    const [is_active, setIs_active] = useState(tag?.is_active ?? true);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit({ name_en, name_fa, sort, is_active });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl p-8">
                <h2 className="text-2xl font-light mb-6">
                    {mode === "add" ? "Add New Tag" : "Edit Tag"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Name (English)</label>
                        <input
                            type="text"
                            value={name_en}
                            onChange={(e) => setName_en(e.target.value)}
                            required
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Name (Persian)</label>
                        <input
                            type="text"
                            value={name_fa}
                            onChange={(e) => setName_fa(e.target.value)}
                            required
                            dir="rtl"
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Sort Order</label>
                        <input
                            type="number"
                            value={sort}
                            onChange={(e) => setSort(Number(e.target.value))}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={is_active}
                            onChange={(e) => setIs_active(e.target.checked)}
                            className="w-5 h-5 rounded border-zinc-700 bg-black text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <label htmlFor="is_active" className="text-sm text-zinc-400">
                            Active
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-6 py-3 rounded-full text-sm transition-colors"
                        >
                            {mode === "add" ? "Add Tag" : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 border border-zinc-700 hover:border-zinc-500 px-6 py-3 rounded-full text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}