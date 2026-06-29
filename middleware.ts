import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth/verify-session";

const locales = ["en", "fa"];
const defaultLocale = "en";

function applySecurityHeaders(response: NextResponse) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    response.headers.set(
        "Content-Security-Policy",
        `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval';
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: blob: https://cdn.sanity.io https:;
            font-src 'self' data:;
            connect-src 'self' https://cdn.sanity.io https://api.sanity.io https:;
            media-src 'self' blob: data: https://cdn.sanity.io;
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
        `.replace(/\s{2,}/g, " ").trim()
    );

    return response;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignore static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Detect locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Redirect to default locale if missing
    if (!pathnameHasLocale) {
        return applySecurityHeaders(
            NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
        );
    }

    // Get locale
    const detectedLocale =
        locales.find(
            (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        ) || defaultLocale;

    // Auth cookie
    const token = request.cookies.get("admin_auth")?.value;

    let isAuthenticated = false;

    if (token) {
        const payload = await verifyAdminToken(token);
        if (payload) {
            isAuthenticated = true;
        }
    }

    // Dashboard paths
    const isDashboardRoute = pathname.startsWith(`/${detectedLocale}/atelier-dashboard`);
    const isLoginRoute = pathname === `/${detectedLocale}/atelier-dashboard/login`;

    // If NOT logged in and accessing dashboard
    if (isDashboardRoute && !isLoginRoute && !isAuthenticated) {
        return applySecurityHeaders(
            NextResponse.redirect(
                new URL(`/${detectedLocale}/atelier-dashboard/login`, request.url)
            )
        );
    }

    // If logged in and visiting login page
    if (isLoginRoute && isAuthenticated) {
        return applySecurityHeaders(
            NextResponse.redirect(
                new URL(`/${detectedLocale}/atelier-dashboard`, request.url)
            )
        );
    }

    const response = applySecurityHeaders(NextResponse.next());
    return response;
}

export const config = {
    matcher: ["/:path*"],
};
