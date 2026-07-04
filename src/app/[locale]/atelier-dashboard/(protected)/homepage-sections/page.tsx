"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type HomepageSection = {
    id: number;
    type: string;
    enabled: boolean;
    sort: number;
    locale: string;
};

function SortableItem({
    section,
    onToggle,
}: {
    section: HomepageSection;
    onToggle: (id: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: section.id,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border border-zinc-800 rounded-3xl p-6 bg-zinc-950"
        >
            <div className="flex items-center justify-between gap-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">
                        {section.locale}
                    </p>
                    <h2 className="text-2xl font-light">{section.type}</h2>
                    <p className="text-zinc-500 mt-2">Sort Order: {section.sort}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        {...attributes}
                        {...listeners}
                        className="w-11 h-11 rounded-2xl border border-zinc-700 hover:bg-zinc-900 cursor-grab active:cursor-grabbing"
                    >
                        ☰
                    </button>
                    <button
                        onClick={() => onToggle(section.id)}
                        className={`px-5 py-3 rounded-full transition ${section.enabled
                            ? "bg-green-600 text-white"
                            : "bg-zinc-800 text-[#a3a3a3]"
                            }`}
                    >
                        {section.enabled ? "Enabled" : "Disabled"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function HomepageSectionsPage() {
    const pathname = usePathname();
    const locale = pathname.startsWith("/fa") ? "fa" : "en";

    const [sections, setSections] = useState<HomepageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        fetchSections();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale]);

    const fetchSections = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `/api/atelier-dashboard/homepage-sections?locale=${locale}`,
                { cache: "no-store" }
            );

            const rawText = await res.text();
            let data: any = {};
            try {
                data = rawText ? JSON.parse(rawText) : {};
            } catch {
                console.error("API returned invalid JSON:", rawText);
                setError("API response is not valid JSON.");
                setSections([]);
                return;
            }

            const list = Array.isArray(data) ? data : Array.isArray(data?.sections) ? data.sections : Array.isArray(data?.data) ? data.data : [];

            if (!Array.isArray(list)) {
                setError("Unexpected API response format.");
                setSections([]);
                return;
            }

            setSections(list);
        } catch (err) {
            console.error(err);
            setError("Failed to load homepage sections.");
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleEnabled = (id: number) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, enabled: !section.enabled } : section
            )
        );
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((item) => item.id === active.id);
        const newIndex = sections.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(sections, oldIndex, newIndex).map(
            (item, index) => ({
                ...item,
                sort: index + 1,
            })
        );
        setSections(reordered);
    };

    const saveChanges = async () => {
        try {
            setSaving(true);
            const res = await fetch("/api/atelier-dashboard/homepage-sections", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // ارسال ساختار مورد نیاز که در کد اول اشاره کردید
                    sections: sections.map((s, i) => ({
                        id: s.id,
                        enabled: s.enabled,
                        sort: i,
                    })),
                    locale,
                }),
            });

            if (!res.ok) throw new Error("Save failed");
            alert("Changes saved");
        } catch (err) {
            console.error(err);
            alert("Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-10 pt-32">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <Link
                            href={`/${locale}/atelier-dashboard`}
                            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition mb-5"
                        >
                            ← Back to Dashboard
                        </Link>
                        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-3">
                            Homepage Manager
                        </p>
                        <h1 className="text-4xl font-light">Homepage Sections</h1>
                    </div>

                    <button
                        onClick={saveChanges}
                        disabled={saving}
                        className="border border-zinc-700 px-5 py-3 rounded-full hover:bg-zinc-900 transition disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/30 p-4 text-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-zinc-500">Loading...</p>
                ) : sections.length === 0 ? (
                    <p className="text-zinc-500">No homepage sections found.</p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sections.map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {sections.map((section) => (
                                    <SortableItem
                                        key={section.id}
                                        section={section}
                                        onToggle={toggleEnabled}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </main>
    );
}
