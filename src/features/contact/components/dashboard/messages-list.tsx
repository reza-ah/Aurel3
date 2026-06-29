export async function MessagesList() {
    const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055";
    const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN;

    const res = await fetch(`${DIRECTUS_URL}/items/messages?sort=-date_created`, {
        headers: { ...(DIRECTUS_TOKEN ? { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` } : {}) },
        cache: 'no-store'
    });

    const { data } = await res.json();

    return (
        <div className="space-y-4 w-full">
            {data?.map((msg: any) => (
                <div key={msg.id} className="p-4 border border-white/10 rounded-lg w-full overflow-hidden">
                    <div className="flex justify-between items-center mb-2 gap-4">
                        <h3 className="font-medium truncate">{msg.name}</h3>
                        <span className="text-xs text-white/50 shrink-0">
                            {new Date(msg.date_created).toLocaleDateString()}
                        </span>
                    </div>

                    {/* استفاده از سبک خاص برای شکستن کلمات طولانی */}
                    <p
                        className="text-white/70 mt-2 w-full"
                        style={{
                            wordBreak: 'break-all',
                            overflowWrap: 'break-word'
                        }}
                    >
                        {msg.message}
                    </p>

                    <a href={`mailto:${msg.email}`} className="text-amber-500 text-sm underline mt-3 block truncate">
                        {msg.email}
                    </a>
                </div>
            ))}
        </div>
    );
}

