"use client";

import { useEffect, useState } from "react";

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    date_created: string;
}

export default function MessagesList() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/atelier-dashboard/contact")
            .then((res) => res.json())
            .then((data) => {
                setMessages(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (messages.length === 0) {
        return <div className="p-4 text-gray-500">No messages yet</div>;
    }

    return (
        <div className="space-y-4">
            {messages.map((msg) => (
                <div
                    key={msg._id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-white">{msg.name}</h3>
                            <p className="text-sm text-gray-400">{msg.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                            {new Date(msg.date_created).toLocaleDateString()}
                        </span>
                    </div>
                    {msg.subject && (
                        <p className="text-sm text-[#C6A86A] mb-2">{msg.subject}</p>
                    )}
                    <p className="text-gray-300">{msg.message}</p>
                    {msg.phone && (
                        <p className="text-sm text-gray-400 mt-2">Phone: {msg.phone}</p>
                    )}
                </div>
            ))}
        </div>
    );
}