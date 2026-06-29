"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AtelierDashboardLoginPage() {
    const pathname = usePathname();

    const locale = pathname?.split("/")?.[1] || "en";
    const isFa = locale === "fa";

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/atelier-dashboard/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                setError(
                    isFa
                        ? "رمز عبور اشتباه است"
                        : "Incorrect password"
                );
                setLoading(false);
                return;
            }

            // full redirect so middleware sees cookie correctly
            window.location.href = `/${locale}/atelier-dashboard`;

        } catch {
            setError(
                isFa
                    ? "خطا در برقراری ارتباط"
                    : "Network error"
            );
            setLoading(false);
        }
    };

    return (
        <main
            dir={isFa ? "rtl" : "ltr"}
            className="min-h-screen bg-black text-white flex items-center justify-center px-6"
        >
            <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 rounded-3xl p-8 md:p-10">
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">
                        Atelier Dashboard
                    </p>

                    <h1 className="text-3xl font-light text-white">
                        {isFa ? "ورود مدیریت" : "Admin Login"}
                    </h1>

                    <p className="mt-4 text-sm text-zinc-500 leading-7">
                        {isFa
                            ? "برای دسترسی به سفارشات و مدیریت پروژه‌ها رمز عبور را وارد کنید."
                            : "Enter your password to access orders and manage projects."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder={
                                isFa ? "رمز عبور" : "Password"
                            }
                            className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-sm text-white outline-none transition focus:border-zinc-600"
                        />
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-white text-black py-4 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? isFa
                                ? "در حال ورود..."
                                : "Signing in..."
                            : isFa
                                ? "ورود"
                                : "Login"}
                    </button>
                </form>
            </div>
        </main>
    );
}
