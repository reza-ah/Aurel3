"use client";

import Link from "next/link";
import { useState } from "react";

import {
    FaInstagram,
    FaWhatsapp,
    FaLinkedinIn,
} from "react-icons/fa";

type Props = {
    locale: "en" | "fa";
};

export default function SiteFooter({ locale }: Props) {
    const isFa = locale === "fa";
    const [footerEmail, setFooterEmail] = useState("");
    const [footerStatus, setFooterStatus] = useState<"idle" | "ok" | "error">("idle");

    async function handleSubscribe() {
        if (!footerEmail.includes("@")) return;
        try {
            const res = await fetch("/api/atelier-dashboard/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: footerEmail,
                    message: "Newsletter subscription",
                    name: "Newsletter",
                    timeSpent: 10,
                    honeypot: "",
                }),
            });
            setFooterStatus(res.ok ? "ok" : "error");
        } catch {
            setFooterStatus("error");
        }
    }

    const content = isFa
        ? {
            brand: "AUREL",

            description:
                "استودیو طراحی جواهرات AUREL با تمرکز بر طراحی سه‌بعدی، مدلسازی تخصصی و تولید حرفه‌ای، تجربه‌ای دقیق و لوکس از خلق جواهرات را ارائه می‌دهد.",

            navigation: "دسترسی سریع",

            newsletter: "خبرنامه",

            newsletterText:
                "برای دریافت جدیدترین اخبار و پروژه‌های جدید عضو شوید.",

            email: "ایمیل شما",

            subscribe: "عضویت",

            rights: "تمامی حقوق محفوظ است.",

            links: [
                {
                    label: "خانه",
                    href: `/${locale}`,
                },
                {
                    label: "نمونه‌کارها",
                    href: `/${locale}/portfolio`,
                },
                {
                    label: "تعرفه خدمات",
                    href: `/${locale}/pricing`,
                },
                {
                    label: "تماس / سفارش",
                    href: `/${locale}/contact`,
                },
                {
                    label: "سوالات متداول",
                    href: `/${locale}/faq`,
                },
                {
                    label: "درباره ما",
                    href: `/${locale}/about`,
                },
                {
                    label: "مقالات",
                    href: `/${locale}/journal`,
                },
            ],
        }
        : {
            brand: "AUREL",

            description:
                "AUREL Jewelry Design Studio specializes in luxury jewelry CAD design, advanced 3D modeling, and professional production-ready services.",

            navigation: "Navigation",

            newsletter: "Newsletter",

            newsletterText:
                "Subscribe to receive our latest news and featured projects.",

            email: "Your Email",

            subscribe: "Subscribe",

            rights: "All rights reserved.",

            links: [
                {
                    label: "Home",
                    href: `/${locale}`,
                },
                {
                    label: "Portfolio",
                    href: `/${locale}/portfolio`,
                },
                {
                    label: "Services & Pricing",
                    href: `/${locale}/pricing`,
                },
                {
                    label: "Contact / Order",
                    href: `/${locale}/contact`,
                },
                {
                    label: "FAQ",
                    href: `/${locale}/faq`,
                },
                {
                    label: "About",
                    href: `/${locale}/about`,
                },
                {
                    label: "Articles",
                    href: `/${locale}/journal`,
                },
            ],
        };

    const socials = [
        {
            icon: FaInstagram,
            href: "https://www.instagram.com/aureldesignstudio",
            label: "Instagram",
        },
        {
            icon: FaWhatsapp,
            href: "https://wa.me/989122987123",
            label: "WhatsApp",
        },
        {
            icon: FaLinkedinIn,
            href: "https://www.linkedin.com/company/aurel-design-studio",
            label: "LinkedIn",
        },
    ];

    return (
        <footer
            dir={isFa ? "rtl" : "ltr"}
            className="relative overflow-hidden border-t border-white/15 bg-[#050505] px-6 py-16"
        >
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#D4AF37]/6 blur-[140px]" />

                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/[0.03] blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* TOP */}
                <div className="grid gap-12 lg:grid-cols-[1.4fr_0.9fr_1fr]">
                    {/* BRAND */}
                    <div>
                        <h2 className="text-3xl font-light tracking-[0.4em] text-white">
                            {content.brand}
                        </h2>

                        <div className="mt-4 h-px w-24 bg-gradient-to-r from-[#D4AF37] to-transparent" />

                        {/* ✅ اصلاح: text-gray-400 → text-white/75 */}
                        <p className="persian-smooth mt-7 max-w-xl text-[15px] leading-8 text-white/75">
                            {content.description}
                        </p>

                        {/* SOCIALS */}
                        <div className="mt-8 flex items-center gap-4">
                            {socials.map((social, index) => {
                                const Icon = social.icon;

                                return (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        aria-label={social.label}
                                        className="
                                            group
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            text-white/70
                                            backdrop-blur-xl
                                            transition-all
                                            duration-500
                                            hover:-translate-y-1
                                            hover:border-[#D4AF37]/40
                                            hover:bg-[#D4AF37]
                                            hover:text-black
                                        "
                                    >
                                        <Icon className="text-[17px] transition-transform duration-300 group-hover:scale-110" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div>
                        <h3 className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {content.navigation}
                        </h3>

                        <ul className="mt-6 grid gap-4">
                            {content.links.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="
                                            group
                                            inline-flex
                                            items-center
                                            text-[15px]
                                            text-white/70
                                            transition-all
                                            duration-300
                                            hover:text-white
                                        "
                                    >
                                        <span className="mr-3 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-5" />

                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* NEWSLETTER + CONTACT */}
                    <div>
                        <h3 className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {content.newsletter}
                        </h3>

                        {/* ✅ اصلاح: text-gray-400 → text-white/70 */}
                        <p className="persian-smooth mt-6 text-sm leading-7 text-white/70">
                            {content.newsletterText}
                        </p>

                        {/* EMAIL INPUT */}
                        <div className="mt-6">
                            {footerStatus === "ok" ? (
                                <p className="text-sm text-[#D4AF37]">
                                    {isFa ? "با موفقیت عضو شدید!" : "Subscribed successfully!"}
                                </p>
                            ) : (
                                <>
                                    <div className="flex overflow-hidden rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                                        <input
                                            type="email"
                                            value={footerEmail}
                                            onChange={e => setFooterEmail(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                                            placeholder={content.email}
                                            className="
                                                w-full
                                                bg-transparent
                                                px-5
                                                py-3.5
                                                text-sm
                                                text-white
                                                outline-none
                                                placeholder:text-white/50
                                            "
                                        />

                                        <button
                                            onClick={handleSubscribe}
                                            className="
                                                group relative overflow-hidden
                                                border-l border-[#D4AF37]/20
                                                px-6
                                                text-[11px]
                                                uppercase tracking-[0.22em]
                                                text-[#D4AF37]
                                                transition-all duration-500
                                                hover:text-black
                                            "
                                        >
                                            <span className="relative z-10">
                                                {content.subscribe}
                                            </span>

                                            <div
                                                className="
                                                    absolute inset-0 origin-left scale-x-0
                                                    bg-[#D4AF37]
                                                    transition-transform duration-500
                                                    group-hover:scale-x-100
                                                "
                                            />
                                        </button>
                                    </div>
                                    {footerStatus === "error" && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {isFa ? "خطا، دوباره تلاش کنید" : "Error, please try again"}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* CONTACT INFO */}
                        <div className="mt-7 space-y-4 text-sm">
                            <div>
                                <p className="mb-1 text-[#C6A86A]">
                                    {isFa ? "ایمیل" : "Email"}
                                </p>

                                <a
                                    href="mailto:studio@aurelstudio.com"
                                    className="text-white/75 transition-colors duration-300 hover:text-[#D4AF37]"
                                >
                                    studio@aurelstudio.com
                                </a>
                            </div>

                            <div>
                                <p className="mb-1 text-[#C6A86A]">
                                    {isFa ? "تلفن" : "Phone"}
                                </p>

                                <a
                                    href="tel:+989122987123"
                                    dir="ltr"
                                    className={`block text-white/75 transition-colors duration-300 hover:text-[#D4AF37] ${isFa ? "text-right" : "text-left"
                                        }`}
                                >
                                    +98 912 2 987 123
                                </a>
                            </div>

                            <div>
                                <p className="mb-1 text-[#C6A86A]">
                                    {isFa ? "آدرس" : "Address"}
                                </p>

                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=35.67639440068573,51.4127901957651"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="leading-7 text-white/75 transition-colors duration-300 hover:text-[#D4AF37]"
                                >
                                    {isFa
                                        ? "تهران، خیابان ۱۵ خرداد"
                                        : "Tehran, Iran"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div
                    className="
                        mt-14
                        flex
                        flex-col
                        items-center
                        justify-between
                        gap-5
                        border-t
                        border-white/10
                        pt-7
                        text-sm
                        text-white/60
                        md:flex-row
                    "
                >
                    <p>
                        © 2026 AUREL — {content.rights}
                    </p>

                    <p className="tracking-[0.15em] text-white/50">
                        LUXURY JEWELRY EXPERIENCE
                    </p>
                </div>
            </div>
        </footer>
    );
}