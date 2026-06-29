"use client";
import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Save, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PricingManager() {
    const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
    const [data, setData] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        const endpoint = activeTab === 'items' ? '/api/atelier-dashboard/pricing' : '/api/atelier-dashboard/pricing-categories';
        const [res, catRes] = await Promise.all([
            fetch(endpoint),
            fetch('/api/atelier-dashboard/pricing-categories')
        ]);
        const json = await res.json();
        const catJson = await catRes.json();
        setData(json.data || []);
        setCategories(catJson.data || []);
    };

    useEffect(() => { fetchData(); }, [activeTab]);

    const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            if (result?.data?.id) {
                setEditingItem((prev: any) => ({ ...prev, img: result.data.id }));
            } else {
                alert("فایل آپلود شد اما آیدی دریافت نشد!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("خطا در آپلود تصویر");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = activeTab === 'items' ? '/api/atelier-dashboard/pricing' : '/api/atelier-dashboard/pricing-categories';

        await fetch(endpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingItem)
        });

        setEditingItem(null);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("آیا مطمئن هستید؟")) return;
        const endpoint = activeTab === 'items' ? '/api/atelier-dashboard/pricing' : '/api/atelier-dashboard/pricing-categories';
        await fetch(endpoint, { method: 'DELETE', body: JSON.stringify({ id }) });
        fetchData();
    };

    return (
        <main className="p-8 text-white min-h-screen max-w-4xl mx-auto mt-12">
            {/* دکمه بازگشت به داشبورد */}
            <Link href="/atelier-dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <h1 className="text-2xl mb-6 font-bold">Pricing Manager</h1>

            {editingItem ? (
                <form onSubmit={handleUpdate} className="bg-zinc-900 p-6 rounded-lg mb-8 border border-zinc-700">
                    <h2 className="text-xl mb-4 border-b border-zinc-700 pb-2">Editing: {editingItem.title_en}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {activeTab === 'items' && (
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="text-xs text-zinc-400">Category</label>
                                <select
                                    className="bg-zinc-800 p-2 rounded"
                                    value={editingItem.category || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.title_en}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-zinc-400">Title EN</label>
                            <input className="bg-zinc-800 p-2 rounded" value={editingItem.title_en || ""} onChange={(e) => setEditingItem({ ...editingItem, title_en: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-zinc-400">Title FA</label>
                            <input className="bg-zinc-800 p-2 rounded" value={editingItem.title_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, title_fa: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-zinc-400">Price EN (Free text)</label>
                            <input className="bg-zinc-800 p-2 rounded" value={editingItem.price_en || ""} onChange={(e) => setEditingItem({ ...editingItem, price_en: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-zinc-400">Price FA (Free text)</label>
                            <input className="bg-zinc-800 p-2 rounded" value={editingItem.price_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, price_fa: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs text-zinc-400">Delivery Time EN (Free text)</label>
                            <textarea className="bg-zinc-800 p-2 rounded" rows={2} value={editingItem.delivery_time_en || ""} onChange={(e) => setEditingItem({ ...editingItem, delivery_time_en: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs text-zinc-400">Delivery Time FA (Free text)</label>
                            <textarea className="bg-zinc-800 p-2 rounded" rows={2} value={editingItem.delivery_time_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, delivery_time_fa: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs text-zinc-400">Description EN</label>
                            <textarea className="bg-zinc-800 p-2 rounded" rows={3} value={editingItem.description_en || ""} onChange={(e) => setEditingItem({ ...editingItem, description_en: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs text-zinc-400">Description FA</label>
                            <textarea className="bg-zinc-800 p-2 rounded" rows={3} value={editingItem.description_fa || ""} onChange={(e) => setEditingItem({ ...editingItem, description_fa: e.target.value })} />
                        </div>

                        <div className="flex flex-col gap-2 col-span-2 my-4">
                            <label className="text-xs text-zinc-400">Current Image</label>
                            {editingItem.img ? (
                                <div className="relative w-32 h-32 border border-zinc-700 rounded overflow-hidden">
                                    <img src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${editingItem.img}`} alt="Current" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-32 h-32 border border-dashed border-zinc-700 rounded flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                            )}
                            <label className="cursor-pointer bg-zinc-700 w-32 text-center py-2 rounded hover:bg-zinc-600 text-sm mt-2">
                                {uploading ? "Uploading..." : "Change Image"}
                                <input type="file" className="hidden" onChange={handleImageUpdate} />
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                        <button type="submit" className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 font-bold"><Save size={16} /> Save Changes</button>
                        <button type="button" onClick={() => setEditingItem(null)} className="bg-zinc-700 px-6 py-2 rounded">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="bg-zinc-900 p-6 rounded-lg">
                    <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2">
                        <button onClick={() => setActiveTab('items')} className={activeTab === 'items' ? "text-white font-bold" : "text-zinc-500"}>Items</button>
                        <button onClick={() => setActiveTab('categories')} className={activeTab === 'categories' ? "text-white font-bold" : "text-zinc-500"}>Categories</button>
                    </div>

                    {data.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-4 border-b border-zinc-800">
                            <span className="text-white font-medium">{item.title_en || "Unnamed"}</span>
                            <div className="flex gap-3">
                                <button onClick={() => setEditingItem(item)} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
