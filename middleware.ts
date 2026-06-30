import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth/verify-session";

const locales = ["en", "fa"];
const defaultLocale = "en";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ✅ ۱. بهینه‌سازی: فایل‌های استاتیک رو رد کن
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // ✅ ۲. Redirect ریشه به defaultLocale
    if (pathname === "/") {
        return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }

    // ✅ ۳. اضافه کردن locale به مسیرهای بدون locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        );
    }

    // ✅ ۴. Admin auth check
    if (pathname.includes("/atelier-dashboard") && !pathname.includes("/login")) {
        const token = request.cookies.get("admin_auth")?.value;

        if (!token) {
            const locale = pathname.split("/")[1] || defaultLocale;
            return NextResponse.redirect(
                new URL(`/${locale}/atelier-dashboard/login`, request.url)
            );
        }

        const payload = await verifyAdminToken(token);
        if (!payload) {
            const locale = pathname.split("/")[1] || defaultLocale;
            return NextResponse.redirect(
                new URL(`/${locale}/atelier-dashboard/login`, request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};