"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // <-- اضافه کن
import LanguageSwitcher from "./language-switcher";

type Props = {
    dict: {
        home: string;
        portfolio: string;
        pricing: string;
        contact: string;
        faq: string;
        about: string,
        blog: string,
    };
};

export default function SiteHeader({ dict }: Props) { // <-- locale رو بردار
    const params = useParams();
    const locale = params.locale as "en" | "fa"; // <-- از useParams بگیر

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: dict.home, href: `/${locale}` },
        { label: dict.portfolio, href: `/${locale}/portfolio` },
        { label: dict.pricing, href: `/${locale}/pricing` },
        { label: dict.contact, href: `/${locale}/contact` },
        { label: dict.faq, href: `/${locale}/faq` },
        { label: dict.about, href: `/${locale}/about` },
        { label: dict.blog, href: `/${locale}/journal` },
    ];

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled ? "border-b border-white/10 bg-black/75 backdrop-blur-xl" : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
                <Link href={`/${locale}`} className="text-2xl font-light tracking-[0.32em] text-[#D4AF37]">
                    AUREL
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm uppercase tracking-[0.22em] ttext-[#f5f5f5] hover:text-[#D4AF37]">
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-5">
                    <LanguageSwitcher locale={locale} />
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" aria-label="Toggle mobile menu">
                        {mobileMenuOpen ? <HiX size={28} /> : <HiOutlineMenuAlt3 size={28} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden">
                    <div className="flex flex-col gap-6 px-6 py-8">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-base uppercase tracking-[0.18em] ttext-[#f5f5f5]">
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </motion.header>
    );
}

