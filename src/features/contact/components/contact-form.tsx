"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
    locale: "fa" | "en";
};

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional().or(z.literal("")),
    subject: z.string().optional(),
    message: z.string().min(10),
    honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm({ locale }: Props) {
    const isFa = locale === "fa";
    const [success, setSuccess] = useState(false);
    const startTime = useRef(Date.now());

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", phone: "", subject: "", message: "", honeypot: "" },
    });

    const watchedFields = watch();

    async function onSubmit(data: ContactFormData) {
        if (data.honeypot) return;
        const timeSpent = Date.now() - startTime.current;

        try {
            const response = await fetch('/api/atelier-dashboard/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, timeSpent }),
            });

            if (response.ok) {
                reset();
                setSuccess(true);
            } else {
                alert(isFa ? "خطایی رخ داد یا امکان ارسال وجود ندارد." : "An error occurred.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (success) {
        return (
            <div dir={isFa ? "rtl" : "ltr"} className="py-16 text-center w-full max-w-xl mx-auto">
                <h3 className="text-2xl font-light text-[rgb(var(--gold))]">
                    {isFa ? "پیام شما دریافت شد" : "Message received"}
                </h3>
                <p className="mt-4 text-white/60 text-sm">
                    {isFa ? "به زودی پاسخ شما را خواهیم داد." : "We will get back to you shortly."}
                </p>
            </div>
        );
    }

    // سینتکس استاندارد اعمال متغیرهای عددی CSS در کلاس‌های سفارشی Tailwind
    const baseInputClass = "w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-white/[0.02]"

    const getInputStyle = (fieldName: keyof ContactFormData) => {
        const hasValue = !!watchedFields[fieldName];
        return `${baseInputClass} ${hasValue
            ? "border-[rgba(var(--gold),0.4)] bg-[rgba(var(--gold),0.01)]"
            : "border-white/10"
            } focus:border-[rgb(var(--gold))] focus:ring-1 focus:ring-[rgba(var(--gold),0.2)]`
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="on"
            className="w-full max-w-4xl mx-auto flex flex-col gap-5 text-right"
        >
            {/* Honeypot */}
            <input type="hidden" {...register("honeypot")} />

            {/* ردیف اول: نام + نشانی ایمیل */}
            <div className="flex flex-col sm:flex-row gap-5 w-full">
                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                        {isFa ? "نام و نام خانوادگی" : "Full Name"}
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        autoComplete="name"
                        placeholder={isFa ? "نام کامل خود را وارد کنید" : "Enter your full name"}
                        className={getInputStyle("name")}
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-400">{isFa ? "نام معتبر وارد کنید" : "Enter a valid name"}</p>}
                </div>

                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                        {isFa ? "نشانی ایمیل" : "Email Address"}
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        autoComplete="email"
                        placeholder={isFa ? "نشانی ایمیل خود را وارد کنید" : "Enter your email address"}
                        className={getInputStyle("email")}
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-400">{isFa ? "ایمیل معتبر نیست" : "Enter a valid email"}</p>}
                </div>
            </div>

            {/* ردیف دوم: شماره تماس + موضوع پیام */}
            <div className="flex flex-col sm:flex-row gap-5 w-full">
                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                        {isFa ? "شماره تماس (اختیاری)" : "Phone Number (Optional)"}
                    </label>
                    <input
                        {...register("phone")}
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        dir="ltr"
                        placeholder={isFa ? "شماره تماس خود را وارد کنید" : "Enter your phone number"}
                        className={`${getInputStyle("phone")} ${isFa ? "text-right" : "text-left"}`}
                    />
                    {errors.phone && <p className="mt-2 text-sm text-red-400">{isFa ? "شماره تماس معتبر نیست" : "Invalid phone"}</p>}
                </div>

                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                        {isFa ? "موضوع پیام" : "Subject"}
                    </label>
                    <input
                        {...register("subject")}
                        type="text"
                        autoComplete="off"
                        placeholder={isFa ? "موضوع پیام خود را بنویسید" : "Enter message subject"}
                        className={getInputStyle("subject")}
                    />
                </div>
            </div>

            {/* متن پیام */}
            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                    {isFa ? "متن پیام" : "Message"}
                </label>
                <textarea
                    {...register("message")}
                    rows={5}
                    className={`${getInputStyle("message")} resize-none`}
                    placeholder={isFa ? "پیام خود را اینجا بنویسید..." : "Write your message here..."}
                />
                {errors.message && <p className="mt-2 text-sm text-red-400">{isFa ? "پیام باید حداقل ۱۰ کاراکتر باشد" : "Too short"}</p>}
            </div>

            {/* دکمه ارسال نهایی */}
            <div className="w-full pt-1">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                >
                    {isSubmitting ? (isFa ? "در حال ارسال..." : "Sending...") : (isFa ? "ارسال پیام" : "Send Message")}
                </button>
            </div>
        </form>
    );
}