import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth/verify-session";



export default async function ProtectedLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    // تغییر به string برای هماهنگی کامل با آنچه Next.js تولید می‌کند
    params: Promise<{ locale: string }>;
}) {

    // مقدار را می‌گیریم و با 'as' به تایپ دلخواهمان تبدیل می‌کنیم تا در بقیه کدها با خیال راحت استفاده شود
    const { locale } = (await params) as { locale: "en" | "fa" };

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_auth")?.value;

    let isAuthenticated = false;

    if (token) {
        const payload = await verifyAdminToken(token);
        if (payload) {
            isAuthenticated = true;
        }
    }

    if (!isAuthenticated) {
        redirect(`/${locale}/atelier-dashboard/login`);
    }

    return <>{children}</>;
}