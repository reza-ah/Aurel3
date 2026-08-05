export async function register() {
    // فقط در سمت سرور و فقط در حالت development
    if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'development') {
        try {
            // ⚠️ غیرفعال کردن TLS verification فقط برای dev (پروکسی باعث mismatch گواهی می‌شود)
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            const { bootstrap } = await import('global-agent');
            process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://127.0.0.1:10808';
            process.env.GLOBAL_AGENT_HTTPS_PROXY = 'http://127.0.0.1:10808';
            process.env.GLOBAL_AGENT_NO_PROXY = 'localhost,127.0.0.1,::1';
            bootstrap();
            console.log('✅ Dev proxy enabled: http://127.0.0.1:10808');
        } catch {
            // اگر global-agent موجود نبود، بی‌صدا رد شو
        }
    }
}