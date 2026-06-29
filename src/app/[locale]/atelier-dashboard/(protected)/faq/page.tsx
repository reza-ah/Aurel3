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

type FAQItem = {
    id: string;
    question: string;
    answer: string;
    sort?: number;
};

function SortableItem({
    item,
    updateItem,
    deleteItem,
}: {
    item: FAQItem;
    updateItem: (id: string, q: string, a: string) => void;
    deleteItem: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [q, setQ] = useState(item.question);
    const [a, setA] = useState(item.answer);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border border-zinc-800 rounded-xl p-6 bg-zinc-950"
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
                onBlur={() => updateItem(item.id, q, a)}
                className="w-full bg-transparent text-xl mb-3"
            />

            <textarea
                value={a}
                onChange={(e) => setA(e.target.value)}
                onBlur={() => updateItem(item.id, q, a)}
                className="w-full bg-transparent text-zinc-400"
            />

            <button
                onClick={() => deleteItem(item.id)}
                className="text-red-400 mt-4"
            >
                Delete
            </button>
        </div>
    );
}

export default function FAQDashboard() {
    const [items, setItems] = useState<FAQItem[]>([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [locale, setLocale] = useState<"en" | "fa">("en");

    const sensors = useSensors(useSensor(PointerSensor));

    async function load(lang: string) {
        const res = await fetch(`/api/atelier-dashboard/faq?locale=${lang}`);
        const data = await res.json();
        setItems(data || []);
    }

    useEffect(() => {
        load(locale);
    }, [locale]);

    async function addItem() {
        if (!question || !answer) return;

        await fetch("/api/atelier-dashboard/faq", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question,
                answer,
                locale,
                enabled: true,
                sort: items.length + 1,
            }),
        });

        setQuestion("");
        setAnswer("");
        load(locale);
    }

    async function deleteItem(id: string) {
        await fetch(`/api/atelier-dashboard/faq?id=${id}`, {
            method: "DELETE",
        });

        load(locale);
    }

    async function updateItem(id: string, question: string, answer: string) {
        await fetch("/api/atelier-dashboard/faq", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                question,
                answer,
            }),
        });
    }

    async function updateSort(newItems: FAQItem[]) {
        setItems(newItems);

        for (let i = 0; i < newItems.length; i++) {
            await fetch("/api/atelier-dashboard/faq", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: newItems[i].id,
                    sort: i + 1,
                }),
            });
        }
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);

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
                            className={`px-4 py-1 rounded ${locale === "en" ? "bg-[] text-black" : "bg-zinc-800"
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
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded"
                        placeholder="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />

                    <textarea
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded"
                        placeholder="Answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />

                    <button
                        onClick={addItem}
                        className="bg-[#d4af37] text-black px-6 py-2 rounded"
                    >
                        Add Question
                    </button>

                </div>

                {/* Drag & Drop */}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-6">
                            {items.map((item) => (
                                <SortableItem
                                    key={item.id}
                                    item={item}
                                    updateItem={updateItem}
                                    deleteItem={deleteItem}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

            </div>
        </main>
    );
}
