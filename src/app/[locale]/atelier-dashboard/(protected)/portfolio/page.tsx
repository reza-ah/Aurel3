"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/+$/, "");

type DirectusFileRef =
    | string
    | {
        id?: string;
        directus_files_id?: string | { id?: string };
    };

type PortfolioItem = {
    id: string;
    title_en?: string;
    title_fa?: string;
    status?: string;
    cover_image?: DirectusFileRef;
    gallery?: DirectusFileRef[];
};

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

function renderStatusBadge(status?: string) {
    const currentStatus = status || "published";
    switch (currentStatus) {
        case "published":
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    Published
                </span>
            );
        case "draft":
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                    Draft
                </span>
            );
        case "archived":
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                    Archived
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400">
                    {currentStatus}
                </span>
            );
    }
}

export default function PortfolioListPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        try {
            setLoading(true);
            const res = await fetch(`/api/atelier-dashboard/portfolio?_t=${Date.now()}`);
            if (!res.ok) throw new Error("Failed to fetch portfolio items");
            const json = await res.json();
            const data = json.data || json;
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    async function deleteItem(id: string) {
        if (!confirm("آیا مطمئن هستی؟")) return;

        try {
            const res = await fetch(`/api/atelier-dashboard/portfolio/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            fetchItems();
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
    }

    return (
        <main className="pt-28 px-8 text-white">
            <div className="mb-6">
                <h1 className="text-3xl font-semibold">Portfolio Manager</h1>
                <p className="text-sm text-zinc-400 mt-1">مدیریت پروژه‌ها و وضعیت انتشار</p>
            </div>

            <div className="flex gap-3 items-center mb-8">
                <Link
                    href="/en/atelier-dashboard"
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition"
                >
                    ← Back to Dashboard
                </Link>
                <Link
                    href="/en/atelier-dashboard/portfolio/new"
                    className="px-5 py-2 bg-emerald-500 text-black rounded-lg hover:brightness-110 transition"
                >
                    + Add New
                </Link>
            </div>

            {loading ? (
                <p>در حال بارگذاری...</p>
            ) : items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-zinc-400 text-xl">هیچ آیتمی وجود ندارد</p>
                </div>
            ) : (
                <div className="rounded-xl border border-zinc-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900 text-zinc-300 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left">Actions</th>
                                <th className="px-4 py-3 text-left">Gallery</th>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Cover</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {items.map((p) => (
                                <tr key={p.id} className="hover:bg-zinc-900/40 transition">
                                    <td className="px-4 py-4">
                                        <Link
                                            href={`/en/atelier-dashboard/portfolio/${p.id}`}
                                            className="text-blue-400 hover:text-blue-300 mr-4"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="text-red-400 hover:text-red-300"
                                            onClick={() => deleteItem(p.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                                            {(p.gallery || []).map((img, i) => {
                                                const id = resolveFileId(img);
                                                if (!id) return null;
                                                return (
                                                    <img
                                                        key={i}
                                                        src={`${DIRECTUS_URL}/assets/${id}`}
                                                        className="w-16 h-16 object-cover rounded-lg border border-zinc-700 snap-start"
                                                        alt={`Gallery ${i}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 font-medium">
                                        <div>{p.title_en}</div>
                                        {p.title_fa && (
                                            <div className="text-xs text-zinc-500 mt-0.5 font-normal">
                                                {p.title_fa}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-4">
                                        {renderStatusBadge(p.status)}
                                    </td>

                                    <td className="px-4 py-4">
                                        {(() => {
                                            const coverId = resolveFileId(p.cover_image);
                                            return coverId ? (
                                                <img
                                                    src={`${DIRECTUS_URL}/assets/${coverId}`}
                                                    className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                                                    alt="Cover"
                                                />
                                            ) : (
                                                <span className="text-zinc-500 text-sm">No cover</span>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}