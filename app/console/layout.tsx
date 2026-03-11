'use client';

import { TopNav } from '@/components/TopNav';

export default function ConsoleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <TopNav />
            <main className="flex-1 transition-all duration-500 overflow-y-auto w-full custom-scrollbar">
                {children}
            </main>
        </div>
    );
}
