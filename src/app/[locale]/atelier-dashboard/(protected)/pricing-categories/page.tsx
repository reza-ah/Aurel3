"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PricingCategory {
    _id: string;
    title_en: string;
    title_fa: string;
    description_en?: string;
    description_fa?: string;
    image?: any;
    sort: number;
}

export default function PricingCategoriesPage() {
    const [categories, setCategories] = useState<PricingCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<PricingCategory | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const pathname = usePathname();
    const locale = pathname?.split("/")?.[1] || "en";

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch("/api/atelier-dashboard/pricing-categories", {
                credentials: "include",
            });
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(newCategory: {
        title_en: string;
        title_fa: string;
        description_en?: string;
        description_fa?: string;
        sort: number;
    }) {
        try {
            const res = await fetch("/api/atelier-dashboard/pricing-categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newCategory),
            });

            if (res.ok) {
                setShowAddForm(false);
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to add category:", error);
        }
    }

    async function handleUpdate(data: {
        title_en: string;
        title_fa: string;
        description_en?: string;
        description_fa?: string;
        sort: number;
    }) {
        if (!editingCategory) return;

        try {
            const res = await fetch("/api/atelier-dashboard/pricing-categories", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    _id: editingCategory._id,
                    ...data,
                }),
            });

            if (res.ok) {
                setEditingCategory(null);
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to update category:", error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await fetch(`/api/atelier-dashboard/pricing-categories?id=${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
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
                        <h1 className="text-4xl md:text-5xl font-light">Pricing Categories</h1>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="border border-zinc-700 hover:border-[#D4AF37] px-6 py-3 rounded-full text-sm transition-colors hover:text-[#D4AF37]"
                    >
                        + Add Category
                    </button>
                </div>

                {/* Add Form Modal */}
                {showAddForm && (
                    <CategoryForm
                        mode="add"
                        onSubmit={handleAdd}
                        onCancel={() => setShowAddForm(false)}
                    />
                )}

                {/* Edit Form Modal */}
                {editingCategory && (
                    <CategoryForm
                        mode="edit"
                        category={editingCategory}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingCategory(null)}
                    />
                )}

                {/* Categories List */}
                <div className="space-y-4">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="border border-zinc-800 bg-zinc-950/70 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-xl font-light">{category.title_en}</h3>
                                        <span className="text-sm text-zinc-500">{category.title_fa}</span>
                                    </div>
                                    {category.description_en && (
                                        <p className="text-sm text-[#a3a3a3] mt-1">{category.description_en}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-zinc-500 mt-2">
                                        <span>Sort: {category.sort}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingCategory(category)}
                                        className="border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="border border-red-900/50 hover:border-red-700 text-red-400 hover:text-red-300 px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
                            No categories found. Click "Add Category" to create one.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

// Category Form Component
function CategoryForm({
    mode,
    category,
    onSubmit,
    onCancel,
}: {
    mode: "add" | "edit";
    category?: PricingCategory;
    onSubmit: (data: {
        title_en: string;
        title_fa: string;
        description_en?: string;
        description_fa?: string;
        sort: number;
    }) => void;
    onCancel: () => void;
}) {
    const [title_en, setTitle_en] = useState(category?.title_en || "");
    const [title_fa, setTitle_fa] = useState(category?.title_fa || "");
    const [description_en, setDescription_en] = useState(category?.description_en || "");
    const [description_fa, setDescription_fa] = useState(category?.description_fa || "");
    const [sort, setSort] = useState(category?.sort || 999);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit({
            title_en,
            title_fa,
            description_en: description_en || undefined,
            description_fa: description_fa || undefined,
            sort,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-light mb-6">
                    {mode === "add" ? "Add New Category" : "Edit Category"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-[#a3a3a3] mb-2">Title (English)</label>
                        <input
                            type="text"
                            value={title_en}
                            onChange={(e) => setTitle_en(e.target.value)}
                            required
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#a3a3a3] mb-2">Title (Persian)</label>
                        <input
                            type="text"
                            value={title_fa}
                            onChange={(e) => setTitle_fa(e.target.value)}
                            required
                            dir="rtl"
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#a3a3a3] mb-2">Description (English)</label>
                        <textarea
                            value={description_en}
                            onChange={(e) => setDescription_en(e.target.value)}
                            rows={3}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#a3a3a3] mb-2">Description (Persian)</label>
                        <textarea
                            value={description_fa}
                            onChange={(e) => setDescription_fa(e.target.value)}
                            rows={3}
                            dir="rtl"
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#a3a3a3] mb-2">Sort Order</label>
                        <input
                            type="number"
                            value={sort}
                            onChange={(e) => setSort(Number(e.target.value))}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-6 py-3 rounded-full text-sm transition-colors"
                        >
                            {mode === "add" ? "Add Category" : "Save Changes"}
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