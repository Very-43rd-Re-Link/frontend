type WeekNavigatorProps = {
    title: string;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
};

export function WeekNavigator({ title, onPreviousWeek, onNextWeek }: WeekNavigatorProps) {
    return (
        <section className="flex items-center justify-center gap-3 text-relink-lavender-intense">
            <button
                type="button"
                onClick={onPreviousWeek}
                className="flex h-8 w-8 items-center justify-center text-[20px] leading-none transition-transform active:scale-90"
                aria-label="이전 주"
            >
                ◀
            </button>
            <p className="min-w-[190px] text-center text-md">{title}</p>
            <button
                type="button"
                onClick={onNextWeek}
                className="flex h-8 w-8 items-center justify-center text-[20px] leading-none transition-transform active:scale-90"
                aria-label="다음 주"
            >
                ▶
            </button>
        </section>
    );
}
