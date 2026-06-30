import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth/verify-session";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    // ✅ بهینه‌سازی: فقط مسیرهای لازم
    // i18n redirect
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/en", request.url));
    }

    // Admin auth check
    if (pathname.includes("/atelier-dashboard") && !pathname.includes("/login")) {
        const token = request.cookies.get("admin_auth")?.value;

        if (!token) {
            const locale = pathname.split("/")[1] || "en";
            return NextResponse.redirect(new URL(`/${locale}/atelier-dashboard/login`, request.url));
        }

        const payload = await verifyAdminToken(token);
        if (!payload) {
            const locale = pathname.split("/")[1] || "en";
            return NextResponse.redirect(new URL(`/${locale}/atelier-dashboard/login`, request.url));
        }
    }

    return response;
}

// ✅ بهینه‌سازی matcher
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
