type LoadingSpinnerProps = {
    label?: string;
    size?: number;
};

export function LoadingSpinner({ label = '불러오는 중', size = 64 }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 font-display text-sm text-relink-gray-500">
            <span
                className="relink-loading-spinner block rounded-full"
                style={{ width: size, height: size }}
                aria-hidden="true"
            />
            <span role="status" aria-live="polite">
                {label}
            </span>
        </div>
    );
}
