"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    disableAnimation?: boolean;
};

export default function Reveal({
    children,
    className = "",
    delay = 0,
    disableAnimation = false,
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(disableAnimation);

    useEffect(() => {
        if (disableAnimation) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.2,
                rootMargin: "0px 0px -100px 0px",
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [disableAnimation]);

    return (
        <div
            ref={ref}
            className={`overflow-visible pt-2 pb-2 ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: disableAnimation ? "none" : `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}