type PlaceholderScreenProps = {
    title: string;
    description: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
    return (
        <main className="flex min-h-0 flex-1 flex-col px-5 pt-12 font-sans">
            <p className="font-display text-[28px] text-relink-ink">{title}</p>
            <p className="mt-3 text-sm leading-6 text-relink-gray-500">{description}</p>
        </main>
    );
}
