import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/common/loading-spinner';

type PlaceholderViewProps = {
    title: string;
    description: string;
};

export function PlaceholderView({ title, description }: PlaceholderViewProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            setIsLoading(false);
        }, 520);

        return () => window.clearTimeout(timerId);
    }, []);

    if (isLoading) {
        return (
            <main className="flex min-h-0 flex-1 items-center justify-center px-5 font-sans">
                <LoadingSpinner />
            </main>
        );
    }

    return (
        <main className="flex min-h-0 flex-1 flex-col px-5 pt-12 font-sans">
            <p className="font-display text-[28px] text-relink-ink">{title}</p>
            <p className="mt-3 text-sm leading-6 text-relink-gray-500">{description}</p>
        </main>
    );
}
