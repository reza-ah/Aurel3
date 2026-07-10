import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth/verify-session";

const locales = ["en", "fa"];
const defaultLocale = "en";
const FA_LOCALE_COUNTRIES = ["IR", "AF", "TJ"];

function getGeoCountry(request: NextRequest): string {
    const country = request.headers.get("x-vercel-ip-country");
    return country || "US";
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get("host") || "";

    // ✅ 1. Static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // ✅ 2. Admin auth
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

    // ✅ 3. Check if locale exists
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // ✅ 4. If has locale, only check non-www
    if (pathnameHasLocale) {
        if (!hostname.startsWith("www.")) {
            const url = request.nextUrl.clone();
            url.hostname = `www.${hostname}`;
            return NextResponse.redirect(url, 301);
        }
        return NextResponse.next();
    }

    // ✅ 5. If no locale, redirect to www + locale in ONE step
    const country = getGeoCountry(request);
    const detectedLocale = FA_LOCALE_COUNTRIES.includes(country) ? "fa" : "en";
    const cookieLocale = request.cookies.get("detected_locale")?.value;
    const finalLocale = cookieLocale || detectedLocale;

    const url = request.nextUrl.clone();
    url.hostname = hostname.startsWith("www.") ? hostname : `www.${hostname}`;
    url.pathname = `/${finalLocale}${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.redirect(url, 301);

    response.cookies.set("detected_locale", finalLocale, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
    });

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};