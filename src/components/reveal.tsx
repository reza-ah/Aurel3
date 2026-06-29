"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

export default function Reveal({
    children,
    className = "",
    delay = 0,
}: RevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8,
                delay,
                ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.2 }}
            className={`overflow-visible pt-2 pb-2 ${className}`}
        >
            {children}
        </motion.div>
    );
}

