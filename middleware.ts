import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth/verify-session";

const locales = ["en", "fa"];
const defaultLocale = "en";

// ✅ لیست کشورهای فارسی‌زبان
const FA_LOCALE_COUNTRIES = ["IR", "AF", "TJ"]; // ایران، افغانستان، تاجیکستان

// ✅ نوع برای geo
interface GeoInfo {
    country?: string;
    city?: string;
    region?: string;
}

function getGeoCountry(request: NextRequest): string {
    // ✅ Vercel Geolocation - استفاده از header
    // Vercel این header ها را اضافه می‌کند:
    // x-vercel-ip-country, x-vercel-ip-city, etc.
    const country = request.headers.get("x-vercel-ip-country");
    return country || "US";
}

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

    // ✅ ۲. Redirect ریشه به locale مناسب بر اساس IP
    if (pathname === "/") {
        // ✅ تشخیص کشور از header های Vercel
        const country = getGeoCountry(request);

        // ✅ تشخیص locale بر اساس کشور
        const detectedLocale = FA_LOCALE_COUNTRIES.includes(country) ? "fa" : "en";

        console.log(`🌍 Geo detection: country=${country}, locale=${detectedLocale}`);

        // ✅ Set cookie برای حفظ انتخاب کاربر
        const response = NextResponse.redirect(
            new URL(`/${detectedLocale}`, request.url)
        );

        response.cookies.set("detected_locale", detectedLocale, {
            maxAge: 60 * 60 * 24 * 30, // 30 روز
            path: "/",
            sameSite: "lax",
        });

        return response;
    }

    // ✅ ۳. اضافه کردن locale به مسیرهای بدون locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        // ✅ اگر کاربر locale ندارد، از cookie یا geo استفاده کن
        const cookieLocale = request.cookies.get("detected_locale")?.value;
        const country = getGeoCountry(request);
        const detectedLocale = cookieLocale || (FA_LOCALE_COUNTRIES.includes(country) ? "fa" : "en");

        return NextResponse.redirect(
            new URL(`/${detectedLocale}${pathname}`, request.url)
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