import Link from "next/link";

export default function NotFound() {
    return (
        <main
            className="relative min-h-screen overflow-hidden bg-[#050505] px-6 flex items-center justify-center"
        >
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#D4AF37]/5 blur-[180px]" />
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white/[0.02] blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#D4AF37]/[0.03] blur-[140px]" />
            </div>

            {/* Subtle Grid Pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                {/* 404 Number */}
                <h1
                    className="
                        text-[10rem]
                        sm:text-[14rem]
                        md:text-[18rem]
                        font-extralight
                        leading-none
                        tracking-tighter
                        bg-gradient-to-b
                        from-[#FFE8A3]
                        via-[#D4AF37]
                        to-[#8B7332]
                        bg-clip-text
                        text-transparent
                        select-none
                    "
                >
                    404
                </h1>

                {/* Divider */}
                <div className="mx-auto my-8 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

                {/* Title - Bilingual */}
                <h2 className="text-3xl md:text-5xl font-light text-white tracking-wide">
                    صفحه پیدا نشد / Page Not Found
                </h2>

                {/* Description - Bilingual */}
                <p className="mt-6 max-w-xl mx-auto text-base md:text-lg leading-8 text-[#e5e5e5]">
                    صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
                    <br />
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Actions */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/fa"
                        className="
                            group relative inline-flex items-center
                            rounded-full border border-[#D4AF37]/40
                            px-10 py-4 text-sm uppercase tracking-[0.2em]
                            text-[#D4AF37]
                            transition-all duration-500
                            hover:bg-[#D4AF37] hover:text-black
                            hover:shadow-[0_0_40px_rgba(212,175,55,0.35)]
                        "
                    >
                        <span className="relative z-10">
                            صفحه اصلی / Home
                        </span>
                    </Link>

                    <Link
                        href="/fa/portfolio"
                        className="
                            inline-flex items-center
                            rounded-full border border-white/10
                            px-10 py-4 text-sm uppercase tracking-[0.2em]
                            text-[#e5e5e5]
                            transition-all duration-300
                            hover:border-white/30 hover:text-white
                        "
                    >
                        نمونه‌کارها / Portfolio
                    </Link>

                    <Link
                        href="/fa/contact"
                        className="
                            inline-flex items-center
                            rounded-full border border-white/10
                            px-10 py-4 text-sm uppercase tracking-[0.2em]
                            text-[#e5e5e5]
                            transition-all duration-300
                            hover:border-white/30 hover:text-white
                        "
                    >
                        تماس با ما / Contact
                    </Link>
                </div>

                {/* Bottom Hint */}
                <p className="mt-16 text-xs uppercase tracking-[0.4em] text-[#a3a3a3]">
                    استودیو طراحی جواهرات اورل / Aurel Jewelry Design Studio
                </p>
            </div>
        </main>
    );
}