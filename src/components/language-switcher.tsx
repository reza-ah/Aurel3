"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher({
    locale,
}: {
    locale: "en" | "fa";
}) {
    const pathname = usePathname();

    const redirectedPathName = (locale: string) => {
        if (!pathname) return "/";

        const segments = pathname.split("/");
        segments[1] = locale;

        return segments.join("/");
    };

    return (
        <div className="flex items-center gap-2">
            <Link
                href={redirectedPathName("en")}
                className={`transition ${locale === "en"
                    ? "text-[#D4AF37]"
                    : "text-white hover:text-[#D4AF37]"
                    }`}
            >
                EN
            </Link>

            <span className="text-gray-500">|</span>

            <Link
                href={redirectedPathName("fa")}
                className={`transition ${locale === "fa"
                    ? "text-[#D4AF37]"
                    : "text-white hover:text-[#D4AF37]"
                    }`}
            >
                فارسی
            </Link>
        </div>
    );
}

