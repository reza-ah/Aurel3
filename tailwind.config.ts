import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",  // ✅ اضافه شد
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",
                gold: "rgb(var(--gold) / <alpha-value>)",
                goldMuted: "rgb(var(--gold-muted) / <alpha-value>)",
            },
            transitionDuration: {
                DEFAULT: "250ms",
            },
        },
    },
    plugins: [],
};

export default config;
