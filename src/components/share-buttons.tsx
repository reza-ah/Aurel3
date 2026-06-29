"use client";

import {
    FaInstagram,
    FaWhatsapp,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";

type Props = {
    isFa: boolean;
    shareUrl: string;
};

export default function ShareButtons({ isFa, shareUrl }: Props) {
    const socials = [
        {
            icon: FaXTwitter,
            href: `https://twitter.com/intent/tweet?url=${shareUrl}`,
            label: "X / Twitter",
        },
        {
            icon: FaLinkedinIn,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
            label: "LinkedIn",
        },
        {
            icon: FaInstagram,
            href: "https://instagram.com",
            label: "Instagram",
        },
        {
            icon: FaWhatsapp,
            href: `https://wa.me/?text=${shareUrl}`,
            label: "WhatsApp",
        },
    ];

    const copyLink = async () => {
        await navigator.clipboard.writeText(shareUrl);
        alert(isFa ? "لینک کپی شد" : "Link copied");
    };

    return (
        <div className="mt-16 flex items-center gap-4">
            {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                    <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        aria-label={social.label}
                        className="
                            group
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.03]
                            text-gray-400
                            backdrop-blur-xl
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:border-[#D4AF37]/50
                            hover:bg-[#D4AF37]
                            hover:text-black
                            hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]
                        "
                    >
                        <Icon className="text-[18px] transition-transform duration-300 group-hover:scale-110" />
                    </a>
                );
            })}

            {/* Copy link */}
            <button
                onClick={copyLink}
                aria-label="Copy link"
                className="
                    group
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.03]
                    text-gray-400
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#D4AF37]/50
                    hover:bg-[#D4AF37]
                    hover:text-black
                    hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]
                "
            >
                {/* Copy icon */}
                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 transition-transform group-hover:scale-110"
                    fill="currentColor"
                >
                    <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" />
                </svg>
            </button>
        </div>
    );
}

