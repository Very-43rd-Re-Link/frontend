import type { PropsWithChildren } from 'react';

export function MobileScreenLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen h-100dvh items-center justify-center bg-relink-white">
      <section className="relative h-[812px] w-[375px] overflow-hidden bg-relink-white">
        {children}
      </section>
    </main>
  );
}
