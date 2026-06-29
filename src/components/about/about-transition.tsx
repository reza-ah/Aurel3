type Props = {
    locale: string;
};

export default function AboutTransition({ locale }: Props) {
    const isFa = locale === "fa";

    return (
        <section className="relative overflow-hidden bg-black py-32 md:py-48">
            {/* ambient glow */}
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A66A]/10 blur-3xl" />
            </div>

            {/* subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, white 1px, transparent 1px),
                        linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }}
            />

            <div className="relative mx-auto max-w-5xl px-6 text-center">
                <p
                    className={`text-3xl font-light leading-[1.8] tracking-[0.08em] text-white/85 md:text-5xl ${isFa ? "font-serif" : ""
                        }`}
                >
                    {isFa
                        ? "هر قطعه، پیش از ساخته شدن، در ذهن متولد می‌شود."
                        : "Every piece exists long before it is created."}
                </p>
            </div>
        </section>
    );
}

