type AppointmentFriendFirstNextButtonProps = {
    selectedCount: number;
    onNext: () => void;
};

export function AppointmentFriendFirstNextButton({ selectedCount, onNext }: AppointmentFriendFirstNextButtonProps) {
    if (selectedCount === 0) {
        return null;
    }

    return (
        <div className="flex flex-none px-1 pb-4 pt-2">
            <button
                type="button"
                className="h-12 w-full rounded-md bg-relink-lavender-intense text-md text-relink-white transition-transform active:scale-[0.98]"
                onClick={onNext}
            >
                다음
                <span className="ml-1 text-relink-white/80">{selectedCount}</span>
            </button>
        </div>
    );
}
