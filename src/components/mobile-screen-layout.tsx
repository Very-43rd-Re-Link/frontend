import type { PropsWithChildren } from 'react';

export function MobileScreenLayout({ children }: PropsWithChildren) {
    return (
        <main className="h-dvh overflow-hidden bg-relink-white">
            <section className="relative mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-relink-white">
                {children}
            </section>
        </main>
    );
}
