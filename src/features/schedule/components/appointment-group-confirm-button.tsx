type AppointmentGroupConfirmButtonProps = {
    isVisible: boolean;
    onConfirm: () => void;
};

export function AppointmentGroupConfirmButton({ isVisible, onConfirm }: AppointmentGroupConfirmButtonProps) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="flex flex-none px-1 pb-4 pt-2">
            <button
                type="button"
                className="h-12 w-full rounded-md bg-relink-lavender-intense text-md text-relink-white transition-transform active:scale-[0.98]"
                onClick={onConfirm}
            >
                확인
            </button>
        </div>
    );
}
