"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
    images: string[];
    title: string;
};

export default function PortfolioGallery({ images, title }: Props) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const closeLightbox = () => setSelectedIndex(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selectedIndex]);

    useEffect(() => {
        document.body.style.overflow = selectedIndex !== null ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [selectedIndex]);

    return (
        <>
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-white/5 blur-3xl" />
            </div>

            <main className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className="relative w-full aspect-[4/5] overflow-hidden rounded-[28px] group bg-zinc-900/40 backdrop-blur-sm text-left cursor-zoom-in border border-white/5"
                        >
                            <Image
                                src={image}
                                alt={`${title}-${index + 1}`}
                                fill
                                unoptimized
                                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                            />
                        </button>
                    ))}
                </div>

                {selectedIndex !== null && (
                    <div
                        className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Swiper container */}
                        <div
                            className="relative w-full max-w-6xl px-16"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Swiper
                                modules={[Navigation, Keyboard, Pagination]}
                                initialSlide={selectedIndex}
                                slidesPerView={1}
                                centeredSlides={true}
                                loop={images.length > 1}
                                touchRatio={1}
                                threshold={50}
                                navigation={{
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                }}
                                keyboard={{ enabled: true }}
                                pagination={{
                                    clickable: true,
                                    el: ".swiper-pagination",
                                }}
                                className="mySwiper"
                                style={{ width: "100%", height: "80vh" }}
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "2rem",
                                                boxSizing: "border-box",
                                                position: "relative",
                                            }}
                                        >
                                            {/* Close button inside each slide */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                                                style={{
                                                    position: "absolute",
                                                    top: 12,
                                                    right: 12,
                                                    zIndex: 9999,
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: "50%",
                                                    background: "rgba(255, 255, 255, 0.08)",
                                                    border: "0px solid rgba(255,255,255,0.25)",
                                                    color: "white",
                                                    fontSize: 16,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                ✕
                                            </button>
                                            <img
                                                src={image}
                                                alt={`${title}-${index + 1}`}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    width: "auto",
                                                    height: "auto",
                                                    objectFit: "contain",
                                                    borderRadius: "1.5rem",
                                                    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                                                }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Navigation Buttons */}
                            <button className="swiper-button-next !text-white after:!text-white absolute right-0 top-1/2 -translate-y-1/2 z-[1040] w-12 h-12 rounded-xl hover:bg-white/20 transition-all hover:scale-110 active:scale-95" />
                            <button className="swiper-button-prev !text-white after:!text-white absolute left-0 top-1/2 -translate-y-1/2 z-[1040] w-12 h-12 rounded-xl hover:bg-white/20 transition-all hover:scale-110 active:scale-95" />

                            {/* Pagination */}
                            <div className="swiper-pagination mt-4" />
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}