"use client"

import { useState, useEffect, useRef } from "react"
import UploadZone from "./upload-zone"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendOrderConfirmationToCustomer, sendOrderNotificationToAdmin } from '@/lib/emailjs'

type Props = {
    locale: "fa" | "en"
    onSuccess?: () => void
}

const orderSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    services: z.array(z.string()).min(1),
    jewelryType: z.string().optional(),
    details: z.string().min(20),
})

type OrderFormData = z.infer<typeof orderSchema>

function formatOrderDetails(data: OrderFormData) {
    return [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Services: ${data.services.join(", ")}`,
        `Jewelry Type: ${data.jewelryType || "N/A"}`,
        `Details: ${data.details}`,
    ].join("\n")
}

export function OrderForm({ locale, onSuccess }: Props) {
    const isFa = locale === "fa"

    const [success, setSuccess] = useState(false)
    const [trackingCode, setTrackingCode] = useState("")
    const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([])
    const [serverError, setServerError] = useState("")

    const [honeypot, setHoneypot] = useState("")
    const startTimeRef = useRef<number>(Date.now())

    useEffect(() => {
        startTimeRef.current = Date.now()
    }, [])

    const services = isFa
        ? ["طراحی", "مدل سازی سه بعدی", "پرینت سه بعدی", "ریخته گری", "اصلاح فایل"]
        : ["Design", "3D Modeling", "3D Printing", "Casting", "File modification"]

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            services: [],
        },
    })

    const selectedServices = watch("services") || []
    const watchedFields = watch()

    async function onSubmit(data: OrderFormData) {
        try {
            setServerError("")

            const timeSpent = Math.max(5, Math.floor((Date.now() - startTimeRef.current) / 1000))

            const payload = {
                full_name: data.name,
                email: data.email,
                phone: data.phone,
                service: data.services.join(", "),
                jewelry_type: data.jewelryType || "",
                details: data.details,
                created_at: new Date().toISOString(),
                files: uploadedFileIds,
                honeypot,
                timeSpent,
            }

            // ❌ حذف: console.log payload اطلاعات مشتری

            const response = await fetch("/api/atelier-dashboard/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            // ❌ حذف: console.log response status
            const result = await response.json();
            // ❌ حذف: console.log response body

            if (!response.ok) throw new Error(result?.error || result?.message || "Order failed")

            const order = result.data
            const orderDetails = formatOrderDetails(data)

            setTrackingCode(result.tracking_code || "N/A")
            setSuccess(true)
            reset()
            setUploadedFileIds([])
            onSuccess?.()

            // ❌ حذف: console.log email sending
            // ❌ حذف: console.log env check

            const emailResults = await Promise.allSettled([
                sendOrderConfirmationToCustomer({
                    customerName: data.name,
                    customerEmail: data.email,
                    orderNumber: String(order._id),
                    orderDetails,
                }),
                sendOrderNotificationToAdmin({
                    customerName: data.name,
                    customerEmail: data.email,
                    customerPhone: data.phone,
                    orderNumber: String(order._id),
                    orderDetails,
                }),
            ]);

            emailResults.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`❌ Email ${index + 1} failed:`, result.reason);
                }
                // ❌ حذف: console.log success - فقط error را نگه می‌داریم
            });
        } catch (error) {
            console.error("Order error:", error)
            setServerError(isFa ? "خطا در ثبت سفارش. دوباره تلاش کنید." : "Failed to submit order.")
        }
    }

    if (success) {
        return (
            <div dir={isFa ? "rtl" : "ltr"} className="py-16 text-center w-full max-w-xl mx-auto">
                <h3 className="text-2xl font-light text-[rgb(var(--gold))]">
                    {isFa ? "سفارش شما ثبت شد" : "Order received"}
                </h3>
                <p className="mt-4 text-[#e5e5e5] text-sm">
                    {isFa
                        ? "همکاران ما به زودی با شما تماس می‌گیرند. لطفا کد پیگیری زیر را ذخیره کنید."
                        : "Our team will contact you shortly. Please save your tracking code."}
                </p>
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 max-w-sm mx-auto">
                    <div className="text-xs text-white/50 uppercase tracking-widest">
                        {isFa ? "کد پیگیری" : "Tracking Code"}
                    </div>
                    <div dir="ltr" className="mt-3 text-3xl font-light tracking-[0.2em] text-[rgb(var(--gold))]">
                        {trackingCode}
                    </div>
                </div>
            </div>
        )
    }

    const baseInputClass = "w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-white/[0.02]"

    const getInputStyle = (fieldName: keyof OrderFormData) => {
        const hasValue = !!watchedFields[fieldName]
        return `${baseInputClass} ${hasValue
            ? "border-[rgba(var(--gold),0.4)] bg-[rgba(var(--gold),0.01)]"
            : "border-white/10"
            } focus:border-[rgb(var(--gold))] focus:ring-1 focus:ring-[rgba(var(--gold),0.2)]`
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="on"
            className="w-full max-w-4xl mx-auto flex flex-col gap-5 text-right"
        >
            <div
                className="absolute left-[-9999px] opacity-0 h-0 w-0 overflow-hidden"
                aria-hidden="true"
                tabIndex={-1}
            >
                <input
                    type="text"
                    name="aurel_hp_token"
                    id="aurel_hp_token"
                    tabIndex={-1}
                    autoComplete="nope"
                    readOnly
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-5 w-full">
                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium">
                        {isFa ? "نام و نام خانوادگی" : "Full Name"}
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        autoComplete="name"
                        placeholder={isFa ? "نام کامل خود را وارد کنید" : "Enter your full name"}
                        className={getInputStyle("name")}
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-400">{isFa ? "نام معتبر وارد کنید" : "Invalid name"}</p>}
                </div>

                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                        {isFa ? "نشانی ایمیل" : "Email Address"}
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        autoComplete="email"
                        placeholder={isFa ? "نشانی ایمیل خود را وارد کنید" : "Enter your email address"}
                        className={getInputStyle("email")}
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-400">{isFa ? "ایمیل معتبر نیست" : "Invalid email"}</p>}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 w-full">
                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                        {isFa ? "شماره تماس" : "Phone Number"}
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
                    {errors.phone && <p className="mt-2 text-sm text-red-400">{isFa ? "شماره معتبر وارد کنید" : "Invalid phone number"}</p>}
                </div>

                <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                        {isFa ? "نوع مدل" : "Jewelry Type"}
                    </label>
                    <input
                        {...register("jewelryType")}
                        type="text"
                        autoComplete="off"
                        placeholder={isFa ? "مثال: انگشتر نامزدی، گردنبند..." : "Example: engagement ring"}
                        className={getInputStyle("jewelryType")}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm uppercase tracking-[0.15em] text-[#e5e5e5] font-medium block">
                    {isFa ? "خدمات مورد نیاز را انتخاب کنید:" : "Select Required Services:"}
                </label>
                <div className="grid gap-2 grid-cols-2 w-full">
                    {services.map((service) => {
                        const isChecked = selectedServices.includes(service)
                        return (
                            <label
                                key={service}
                                className={`flex items-center justify-between w-full rounded-xl border px-4 py-3 cursor-pointer select-none transition-all duration-300 ${isChecked
                                    ? "border-[rgba(var(--gold),0.4)] bg-[rgba(var(--gold),0.04)] text-white"
                                    : "border-white/10 bg-white/[0.02] text-[#e5e5e5] hover:border-white/20 hover:bg-white/[0.03]"
                                    }`}
                            >
                                <span className="text-sm font-light tracking-wide">{service}</span>
                                <input
                                    type="checkbox"
                                    value={service}
                                    {...register("services")}
                                    style={{ accentColor: "rgb(var(--gold))" }}
                                    className="w-4.5 h-4.5 rounded border-white/30 bg-transparent text-[rgb(var(--gold))] focus:ring-0 cursor-pointer transition-all"
                                />
                            </label>
                        )
                    })}
                </div>
                {errors.services && <p className="mt-2 text-sm text-red-400">{isFa ? "لطفاً حداقل یک مورد را انتخاب کنید" : "Select at least one"}</p>}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                    {isFa ? "توضیحات سفارش" : "Order Details"}
                </label>
                <textarea
                    {...register("details")}
                    rows={4}
                    className={`${getInputStyle("details")} resize-none`}
                    placeholder={
                        isFa
                            ? "توضیحات سفارش، متریال، سنگ‌ها، سایز و جزئیات طراحی..."
                            : "Describe the jewelry, materials, gemstones, dimensions, and design ideas..."
                    }
                />
                {errors.details && <p className="mt-2 text-sm text-red-400">{isFa ? "توضیحات باید حداقل ۲۰ کاراکتر باشد" : "Too short"}</p>}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm uppercase tracking-[0.15em] text-white/85 font-medium block">
                    {isFa ? "فایل ضمیمه" : "Attachments"}
                </label>
                <UploadZone locale={locale} onUploaded={setUploadedFileIds} />
                {uploadedFileIds.length > 0 && (
                    <div className="text-xs text-green-400 mt-1">
                        {uploadedFileIds.length} file(s) uploaded
                    </div>
                )}
            </div>

            {serverError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 w-full">
                    {serverError}
                </div>
            )}

            <div className="w-full pt-1">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                >
                    {isSubmitting
                        ? (isFa ? "در حال ارسال..." : "Submitting...")
                        : (isFa ? "ثبت سفارش" : "Submit Order")}
                </button>
            </div>
        </form>
    )
}