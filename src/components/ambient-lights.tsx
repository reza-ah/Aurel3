"use client";

export default function AmbientLights() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* ✅ اصلاح: حذف framer-motion، استفاده از CSS animation */}
            <div
                className="
                    absolute
                    left-[-10%]
                    top-[10%]
                    h-[280px]
                    w-[280px]
                    rounded-full
                    bg-[#D4AF37]/10
                    blur-2xl
                    animate-float-1
                "
            />

            <div
                className="
                    absolute
                    right-[-10%]
                    bottom-[5%]
                    h-[240px]
                    w-[240px]
                    rounded-full
                    bg-white/5
                    blur-2xl
                    animate-float-2
                "
            />
        </div>
    );
}