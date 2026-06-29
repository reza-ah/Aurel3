"use client";

import { useState, useRef } from "react";
import { ContactForm } from "./contact-form";
import { OrderForm } from "./order-form";

type Props = {
    locale: "fa" | "en";
};

export function ContactTabs({ locale }: Props) {
    const isFa = locale === "fa";
    const [activeTab, setActiveTab] = useState<"contact" | "order">("order");
    const topRef = useRef<HTMLDivElement>(null);

    function scrollToTop() {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div className="space-y-8" ref={topRef}>
            {/* TAB NAVIGATOR */}
            <div className="flex items-center gap-5 border-b border-white/20 pb-4" dir={isFa ? "rtl" : "ltr"}>
                <button
                    onClick={() => setActiveTab("contact")}
                    className={`text-sm font-medium tracking-wide transition-all duration-300 outline-none ${activeTab === "contact"
                        ? "text-[#d4af37]"
                        : "text-white/70 hover:text-white/90"
                        }`}
                >
                    {isFa ? "ارتباط با ما" : "Contact Us"}
                </button>

                <span className="w-px h-4 bg-white/30 block" />

                <button
                    onClick={() => setActiveTab("order")}
                    className={`text-sm font-medium tracking-wide transition-all duration-300 outline-none ${activeTab === "order"
                        ? "text-[#d4af37]"
                        : "text-white/70 hover:text-white/90"
                        }`}
                >
                    {isFa ? "سفارش طراحی و ساخت" : "Custom Jewelry Order"}
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="transition-all duration-300 pt-2">
                {activeTab === "contact" ? (
                    <ContactForm locale={locale} />
                ) : (
                    <OrderForm locale={locale} onSuccess={scrollToTop} />
                )}
            </div>
        </div>
    );
}