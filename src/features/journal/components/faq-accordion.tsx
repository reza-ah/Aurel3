"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    locale: string;
    items: any[];
};

export default function FAQAccordion({ locale, items }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const isFa = locale === "fa";

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {items.map((item: any, index: number) => {
                const isOpen = openIndex === index;

                return (
                    <div key={item.id} className="group border-b border-white/5">
                        {/* QUESTION */}
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="flex w-full items-center justify-between py-8 transition-all group-hover:px-3"
                        >
                            <div className="flex flex-col items-start gap-2 text-left">
                                <span className="text-[10px] tracking-[0.35em] text-[#d4af37] opacity-0 group-hover:opacity-100 transition">
                                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                </span>

                                <h3
                                    className={`text-xl md:text-2xl font-light transition ${isOpen ? "text-[#d4af37]" : "text-white/80"
                                        }`}
                                >
                                    {item.question}
                                </h3>
                            </div>

                            {/* ICON */}
                            <div className="relative w-6 h-6">
                                <span
                                    className={`absolute top-1/2 left-0 w-full h-[1px] bg-white transition ${isOpen ? "opacity-0" : ""
                                        }`}
                                />

                                <span
                                    className={`absolute top-1/2 left-0 w-full h-[1px] bg-white transition rotate-90 ${isOpen ? "rotate-0" : ""
                                        }`}
                                />
                            </div>
                        </button>

                        {/* ANSWER */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-8 pt-2 max-w-3xl">
                                        <div
                                            className="faq-content text-white/60 text-sm md:text-base leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: item.answer }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

