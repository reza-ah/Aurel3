import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
    // ✅ در Server Component، از headers استفاده کن
    const headersList = await headers();

    // ✅ Vercel Geolocation در Server Component
    // نکته: در Server Component، geo مستقیم در دسترس نیست
    // پس از cookie یا default استفاده می‌کنیم

    // ✅ اگر cookie detected_locale وجود دارد، از آن استفاده کن
    const cookieHeader = headersList.get("cookie") || "";
    const detectedLocaleMatch = cookieHeader.match(/detected_locale=([^;]+)/);
    const detectedLocale = detectedLocaleMatch?.[1] || "en";

    redirect(`/${detectedLocale}`);
}