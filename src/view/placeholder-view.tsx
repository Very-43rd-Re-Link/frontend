import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PlaceholderScreen } from '@/components/common/placeholder-screen';

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

    return <PlaceholderScreen title={title} description={description} />;
}
