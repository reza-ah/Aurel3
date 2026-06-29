import React from 'react';

interface PageBaseProps {
    children: React.ReactNode;
}

export default function PageBase({ children }: PageBaseProps) {
    return (
        <main className="w-full min-h-screen">
            {children}
        </main>
    );
}