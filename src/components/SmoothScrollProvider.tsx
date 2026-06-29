"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrollProvider({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            syncTouch: false, // ← موبایل رو خاموش کن، مشکل‌ساز بود
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        const rafId = requestAnimationFrame(raf);

        let scrollTimeout: NodeJS.Timeout;
        lenis.on('scroll', () => {
            document.body.classList.add('lenis-scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('lenis-scrolling');
            }, 150);
        });

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            clearTimeout(scrollTimeout);
        };
    }, []);

    return <>{children}</>;
}