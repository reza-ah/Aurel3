"use client";

import { useEffect, useState } from "react";
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

// ✅ اصلاح: استفاده از _id و question_en/fa
type FAQItem = {
    _id: string;
    question_en: string;
    question_fa: string;
    answer_en: string;
    answer_fa: string;
    sort?: number;
    enabled?: boolean;
    locale?: string;
};

function SortableItem({
    item,
    locale,
    updateItem,
    deleteItem,
}: {
    item: FAQItem;
    locale: "en" | "fa";
    updateItem: (id: string, question: string, answer: string, enabled: boolean) => void;
    deleteItem: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: item._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // ✅ اصلاح: استفاده از question_en/fa بر اساس locale
    const [q, setQ] = useState(locale === "fa" ? item.question_fa : item.question_en);
    const [a, setA] = useState(locale === "fa" ? item.answer_fa : item.answer_en);
    const [enabled, setEnabled] = useState(item.enabled !== false);

    // ✅ به‌روزرسانی state وقتی locale تغییر می‌کند
    useEffect(() => {
        setQ(locale === "fa" ? item.question_fa : item.question_en);
        setA(locale === "fa" ? item.answer_fa : item.answer_en);
        setEnabled(item.enabled !== false);
    }, [locale, item]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`border rounded-xl p-6 ${enabled ? "border-zinc-800 bg-zinc-950" : "border-red-900/50 bg-red-950/20"}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab text-zinc-500 mb-4"
            >
                ⇅ Drag
            </div>

            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => updateItem(item._id, q, a, enabled)}
                placeholder={locale === "fa" ? "سوال (فارسی)" : "Question (English)"}
                className="w-full bg-transparent text-xl mb-3 text-white placeholder:text-zinc-600"
            />

            <textarea
                value={a}
                onChange={(e) => setA(e.target.value)}
                onBlur={() => updateItem(item._id, q, a, enabled)}
                placeholder={locale === "fa" ? "پاسخ (فارسی)" : "Answer (English)"}
                className="w-full bg-transparent text-zinc-300 min-h-[100px] placeholder:text-zinc-600"
            />

            <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => {
                            setEnabled(e.target.checked);
                            updateItem(item._id, q, a, e.target.checked);
                        }}
                        className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-400">
                        {enabled ? "✓ Enabled" : "✗ Disabled"}
                    </span>
                </label>

                <button
                    onClick={() => deleteItem(item._id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default function FAQDashboard() {
    const [items, setItems] = useState<FAQItem[]>([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [locale, setLocale] = useState<"en" | "fa">("en");
    const [loading, setLoading] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    async function load(lang: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/atelier-dashboard/faq?locale=${lang}`);
            const data = await res.json();
            setItems(data || []);
        } catch (error) {
            console.error("Load FAQ error:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load(locale);
    }, [locale]);

    // ✅ اصلاح: ارسال فرمت درست به API
    async function addItem() {
        if (!question || !answer) return;

        try {
            const body = locale === "fa"
                ? { question_fa: question, answer_fa: answer, locale: "fa" }
                : { question_en: question, answer_en: answer, locale: "en" };

            await fetch("/api/atelier-dashboard/faq", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...body,
                    enabled: true,
                    sort: items.length + 1,
                }),
            });

            setQuestion("");
            setAnswer("");
            load(locale);
        } catch (error) {
            console.error("Add FAQ error:", error);
        }
    }

    async function deleteItem(id: string) {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;

        try {
            await fetch(`/api/atelier-dashboard/faq?id=${id}`, {
                method: "DELETE",
            });

            load(locale);
        } catch (error) {
            console.error("Delete FAQ error:", error);
        }
    }

    // ✅ اصلاح: ارسال فرمت درست به API
    async function updateItem(id: string, question: string, answer: string, enabled: boolean) {
        try {
            const body = locale === "fa"
                ? { question_fa: question, answer_fa: answer }
                : { question_en: question, answer_en: answer };

            await fetch("/api/atelier-dashboard/faq", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    ...body,
                    enabled,
                }),
            });
        } catch (error) {
            console.error("Update FAQ error:", error);
        }
    }

    async function updateSort(newItems: FAQItem[]) {
        setItems(newItems);

        try {
            for (let i = 0; i < newItems.length; i++) {
                await fetch("/api/atelier-dashboard/faq", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: newItems[i]._id,
                        sort: i + 1,
                    }),
                });
            }
        } catch (error) {
            console.error("Update sort error:", error);
        }
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i._id === active.id);
            const newIndex = items.findIndex((i) => i._id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            updateSort(newItems);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white p-10 pt-32">
            <div className="max-w-4xl mx-auto">

                <div className="flex justify-between mb-10">

                    <h1 className="text-4xl font-light">
                        FAQ Manager
                    </h1>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setLocale("en")}
                            className={`px-4 py-1 rounded ${locale === "en" ? "bg-[#d4af37] text-black" : "bg-zinc-800"
                                }`}
                        >
                            EN
                        </button>

                        <button
                            onClick={() => setLocale("fa")}
                            className={`px-4 py-1 rounded ${locale === "fa" ? "bg-[#d4af37] text-black" : "bg-zinc-800"
                                }`}
                        >
                            FA
                        </button>
                    </div>

                </div>

                {/* Add */}

                <div className="mb-12 space-y-4">

                    <input
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded text-white placeholder:text-zinc-500"
                        placeholder={locale === "fa" ? "سوال (فارسی)" : "Question (English)"}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />

                    <textarea
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded text-white placeholder:text-zinc-500 min-h-[100px]"
                        placeholder={locale === "fa" ? "پاسخ (فارسی)" : "Answer (English)"}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />

                    <button
                        onClick={addItem}
                        disabled={loading}
                        className="bg-[#d4af37] text-black px-6 py-2 rounded hover:bg-[#e5c76b] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Add Question"}
                    </button>

                </div>

                {/* Drag & Drop */}

                {loading ? (
                    <div className="text-center text-zinc-500 py-12">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="text-center text-zinc-500 py-12">
                        No FAQs found. Add your first question above.
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map((i) => i._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <SortableItem
                                        key={item._id}
                                        item={item}
                                        locale={locale}
                                        updateItem={updateItem}
                                        deleteItem={deleteItem}
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