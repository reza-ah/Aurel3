"use client";
import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Save, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";

// ✅ تابع کمکی برای ساخت URL تصویر Sanity
function getImageUrl(image: any): string | null {
    if (!image) return null;

    try {
        if (typeof image === "string") {
            return urlFor({ _type: "image", asset: { _ref: image } }).width(200).url();
        }

        if (image.asset) {
            return urlFor(image).width(200).url();
        }

        if (image._ref) {
            return urlFor({ _type: "image", asset: { _ref: image._ref } }).width(200).url();
        }

        return null;
    } catch {
        return null;
    }
}

// ✅ فرم خالی برای item جدید
const emptyItem = {
    title_en: "",
    title_fa: "",
    description_en: "",
    description_fa: "",
    price_en: "",
    price_fa: "",
    delivery_time_en: "",
    delivery_time_fa: "",
    suitable_en: "",
    suitable_fa: "",
    features_en: "",
    features_fa: "",
    img: null,
    category: null,
    sort: 999,
    is_active: true,
};

// ✅ فرم خالی برای category جدید
const emptyCategory = {
    title_en: "",
    title_fa: "",
    description_en: "",
    description_fa: "",
    image: null,
    sort: 999,
};

export default function PricingManager() {
    const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [res, catRes] = await Promise.all([
                fetch('/api/atelier-dashboard/pricing'),
                fetch('/api/atelier-dashboard/pricing-categories')
            ]);
            const json = await res.json();
            const catJson = await catRes.json();
            setItems(Array.isArray(json.items) ? json.items : []);
            setCategories(Array.isArray(catJson) ? catJson : []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [activeTab]);

    // ✅ آپلود تصویر
    const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>, field: 'img' | 'image') => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            const res = await fetch("/api/atelier-dashboard/files/upload", {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (result?.data?._id) {
                setEditingItem((prev: any) => ({ ...prev, [field]: result.data._id }));
            } else {
                alert("File uploaded but ID not received!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    // ✅ Save (Update یا Create)
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const isCategory = activeTab === 'categories';
            const endpoint = isCategory ? '/api/atelier-dashboard/pricing-categories' : '/api/atelier-dashboard/pricing';
            const method = editingItem._id ? 'PATCH' : 'POST';

            await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem)
            });

            setEditingItem(null);
            fetchData();
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save");
        }
    };

    // ✅ Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this?")) return;
        try {
            const endpoint = activeTab === 'items' ? '/api/atelier-dashboard/pricing' : '/api/atelier-dashboard/pricing-categories';
            await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // ✅ Toggle active
    const handleToggleActive = async (item: any) => {
        try {
            await fetch('/api/atelier-dashboard/pricing', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: item._id,
                    is_active: !item.is_active,
                })
            });
            fetchData();
        } catch (error) {
            console.error("Toggle error:", error);
        }
    };

    return (
        <main className="p-8 text-white min-h-screen max-w-5xl mx-auto mt-12">
            {/* دکمه بازگشت به داشبورد */}
            <Link href="/atelier-dashboard" className="flex items-center gap-2 text-[#a3a3a3] hover:text-white mb-8 transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <h1 className="text-3xl mb-8 font-bold">Pricing Manager</h1>

            {/* فرم Edit/Create */}
            {editingItem ? (
                <form onSubmit={handleUpdate} className="bg-zinc-900 p-6 rounded-lg mb-8 border border-zinc-700">
                    <h2 className="text-xl mb-4 border-b border-zinc-700 pb-2">
                        {editingItem._id ? `Editing: ${editingItem.title_en || "Unnamed"}` : "Create New"}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {activeTab === 'items' && (
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="text-xs text-[#a3a3a3]">Category</label>
                                <select
                                    className="bg-zinc-800 p-2 rounded text-white"
                                    value={editingItem.category?._ref || editingItem.category || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value ? { _type: "reference", _ref: e.target.value } : null })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.title_en}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#a3a3a3]">Title EN</label>
                            <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.title_en || ""} onChange={(e) => setEditingItem({ ...editingItem, title_en: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[#a3a3a3]">Title FA</label>
                            <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.title_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, title_fa: e.target.value })} />
                        </div>
                        {activeTab === 'items' && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#a3a3a3]">Price EN</label>
                                    <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.price_en || ""} onChange={(e) => setEditingItem({ ...editingItem, price_en: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-[#a3a3a3]">Price FA</label>
                                    <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.price_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, price_fa: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="text-xs text-[#a3a3a3]">Delivery Time EN</label>
                                    <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.delivery_time_en || ""} onChange={(e) => setEditingItem({ ...editingItem, delivery_time_en: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="text-xs text-[#a3a3a3]">Delivery Time FA</label>
                                    <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.delivery_time_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, delivery_time_fa: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="text-xs text-[#a3a3a3]">Suitable For EN</label>
                                    <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.suitable_en || ""} onChange={(e) => setEditingItem({ ...editingItem, suitable_en: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="text-xs text-[#a3a3a3]">Suitable For FA</label>
                                    <input className="bg-zinc-800 p-2 rounded text-white" value={editingItem.suitable_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, suitable_fa: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="text-xs text-[#a3a3a3]">Features EN (one per line)</label>
                                    <textarea className="bg-zinc-800 p-2 rounded text-white" rows={3} value={editingItem.features_en || ""} onChange={(e) => setEditingItem({ ...editingItem, features_en: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <label className="text-xs text-[#a3a3a3]">Features FA (one per line)</label>
                                    <textarea className="bg-zinc-800 p-2 rounded text-white" rows={3} value={editingItem.features_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, features_fa: e.target.value })} />
                                </div>
                            </>
                        )}
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs text-[#a3a3a3]">Description EN</label>
                            <textarea className="bg-zinc-800 p-2 rounded text-white" rows={3} value={editingItem.description_en || ""} onChange={(e) => setEditingItem({ ...editingItem, description_en: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs text-[#a3a3a3]">Description FA</label>
                            <textarea className="bg-zinc-800 p-2 rounded text-white" rows={3} value={editingItem.description_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, description_fa: e.target.value })} />
                        </div>

                        {/* Image Upload */}
                        <div className="flex flex-col gap-2 col-span-2 my-4">
                            <label className="text-xs text-[#a3a3a3]">Image</label>
                            {(() => {
                                const imgUrl = getImageUrl(activeTab === 'items' ? editingItem.img : editingItem.image);
                                return imgUrl ? (
                                    <div className="relative w-32 h-32 border border-zinc-700 rounded overflow-hidden">
                                        <img src={imgUrl} alt="Current" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 border border-dashed border-zinc-700 rounded flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                                );
                            })()}
                            <label className="cursor-pointer bg-zinc-700 w-32 text-center py-2 rounded hover:bg-zinc-600 text-sm mt-2">
                                {uploading ? "Uploading..." : "Change Image"}
                                <input type="file" className="hidden" onChange={(e) => handleImageUpdate(e, activeTab === 'items' ? 'img' : 'image')} />
                            </label>
                        </div>

                        {activeTab === 'items' && (
                            <div className="flex items-center gap-2 col-span-2">
                                <input
                                    type="checkbox"
                                    checked={editingItem.is_active !== false}
                                    onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label className="text-sm text-[#a3a3a3]">Active</label>
                            </div>
                        )}

                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs text-[#a3a3a3]">Sort Order</label>
                            <input type="number" className="bg-zinc-800 p-2 rounded text-white" value={editingItem.sort || 999} onChange={(e) => setEditingItem({ ...editingItem, sort: parseInt(e.target.value) || 999 })} />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button type="submit" className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 font-bold hover:bg-zinc-200 transition-colors">
                            <Save size={16} /> {editingItem._id ? "Save Changes" : "Create"}
                        </button>
                        <button type="button" onClick={() => setEditingItem(null)} className="bg-zinc-700 px-6 py-2 rounded hover:bg-zinc-600 transition-colors">Cancel</button>
                    </div>
                </form>
            ) : null}

            {/* Tabs */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-2">
                    <div className="flex gap-4">
                        <button onClick={() => { setActiveTab('items'); setEditingItem(null); }} className={`pb-2 transition-colors ${activeTab === 'items' ? "text-white font-bold border-b-2 border-[#d4af37]" : "text-zinc-500"}`}>
                            Items ({items.length})
                        </button>
                        <button onClick={() => { setActiveTab('categories'); setEditingItem(null); }} className={`pb-2 transition-colors ${activeTab === 'categories' ? "text-white font-bold border-b-2 border-[#d4af37]" : "text-zinc-500"}`}>
                            Categories ({categories.length})
                        </button>
                    </div>
                    <button
                        onClick={() => setEditingItem(activeTab === 'items' ? { ...emptyItem } : { ...emptyCategory })}
                        className="bg-[#d4af37] text-black px-4 py-2 rounded flex items-center gap-2 font-bold hover:bg-[#e5c76b] transition-colors"
                    >
                        <Plus size={16} /> Add New
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-zinc-500 py-12">Loading...</div>
                ) : (
                    <div className="space-y-2">
                        {(activeTab === 'items' ? items : categories).map((item: any) => (
                            <div key={item._id} className="flex justify-between items-center py-4 border-b border-zinc-800 hover:bg-zinc-800/50 px-4 rounded transition-colors">
                                <div className="flex items-center gap-4">
                                    {(() => {
                                        const imgUrl = getImageUrl(activeTab === 'items' ? item.img : item.image);
                                        return imgUrl ? (
                                            <img src={imgUrl} alt="" className="w-12 h-12 object-cover rounded" />
                                        ) : (
                                            <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center text-zinc-600 text-xs">No img</div>
                                        );
                                    })()}
                                    <div>
                                        <span className="text-white font-medium">{item.title_en || "Unnamed"}</span>
                                        {item.title_fa && <span className="text-zinc-500 text-sm ml-2">({item.title_fa})</span>}
                                        {activeTab === 'items' && item.category && (
                                            <span className="text-zinc-600 text-xs block">{item.category.title_en}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {activeTab === 'items' && (
                                        <button
                                            onClick={() => handleToggleActive(item)}
                                            className={`px-3 py-1 rounded text-xs ${item.is_active ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
                                        >
                                            {item.is_active ? "Active" : "Inactive"}
                                        </button>
                                    )}
                                    <button onClick={() => setEditingItem({ ...item })} className="text-blue-400 hover:text-blue-300">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-400">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {(activeTab === 'items' ? items : categories).length === 0 && (
                            <div className="text-center text-zinc-500 py-12">
                                No {activeTab} found. Click "Add New" to create one.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}