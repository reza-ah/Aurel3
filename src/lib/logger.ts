const isDev = process.env.NODE_ENV !== "production";

export function logError(context: string, error?: unknown) {
    if (isDev) {
        console.error(`[${context}]`, error ?? "");
    }
}

export function logWarn(context: string, message: string) {
    if (isDev) {
        console.warn(`[${context}]`, message);
    }
}

export function logDebug(context: string, data?: unknown) {
    if (isDev) {
        console.log(`[${context}]`, data ?? "");
    }
}
