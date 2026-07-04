"use client";

import AmbientLights from "./ambient-lights";
import Reveal from "./reveal";

type Props = {
    dict: {
        heroTitle: string;
        heroDescription: string;
        explore: string;
    };
};

export default function LuxuryHero({ dict }: Props) {
    return (
        <section
            className="
                relative
                min-h-screen
                overflow-x-hidden
                overflow-y-visible
                bg-transparent
                px-6
                py-28
                lg:py-36
                flex
                items-center
                justify-center
            "
        >
            {/* Ambient Lights */}
            <AmbientLights />

            {/* Soft Background Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="
                        absolute
                        left-1/2
                        top-0
                        h-[500px]
                        w-[500px]
                        -translate-x-1/2
                        rounded-full
                        bg-[#D4AF37]/10
                        blur-3xl
                    "
                />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-5xl text-center">

                {/* ✅ Title - disableAnimation برای LCP */}
                <Reveal disableAnimation>
                    <h1
                        className="
                            text-5xl
                            sm:text-6xl
                            md:text-7xl
                            font-light
                            leading-tight
                            mb-8
                        "
                    >
                        <span
                            className="
                                bg-gradient-to-r
                                from-white
                                via-[#E7C65C]
                                to-[#D4AF37]
                                bg-clip-text
                                text-transparent
                            "
                        >
                            {dict.heroTitle}
                        </span>
                    </h1>
                </Reveal>

                {/* ✅ Description - disableAnimation برای LCP */}
                <Reveal disableAnimation delay={0.1}>
                    <p
                        className="
                            mx-auto
                            max-w-3xl
                            text-base
                            sm:text-lg
                            md:text-xl
                            leading-8
                            text-white/75
                        "
                    >
                        {dict.heroDescription}
                    </p>
                </Reveal>

                {/* CTA - انیمیشن عادی */}
                <Reveal delay={0.2}>
                    <div className="mt-12">
                        <button
                            className="
                                rounded-full
                                border
                                border-[#D4AF37]/60
                                px-10
                                py-4
                                text-sm
                                uppercase
                                tracking-wide
                                text-[#D4AF37]
                                transition-all
                                duration-300
                                hover:bg-[#D4AF37]
                                hover:text-black
                            "
                        >
                            {dict.explore}
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* Bottom Fade */}
            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-0
                    h-32
                    w-full
                    bg-transparent
                    from-black
                    to-transparent
                "
            />
        </section>
    );
}