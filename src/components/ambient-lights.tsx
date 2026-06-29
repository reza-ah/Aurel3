"use client";

import { motion } from "framer-motion";

export default function AmbientLights() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="
                    absolute
                    left-[-10%]
                    top-[10%]
                    h-[280px]
                    w-[280px]
                    rounded-full
                    bg-[#D4AF37]/10
                    blur-2xl
                "
            />

            <motion.div
                animate={{
                    x: [0, -25, 0],
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="
                    absolute
                    right-[-10%]
                    bottom-[5%]
                    h-[240px]
                    w-[240px]
                    rounded-full
                    bg-white/5
                    blur-2xl
                "
            />
        </div>
    );
}

