import { editableStatusOrder, statusConfig } from '@/features/schedule/constants';
import type { EditableSlotStatus } from '@/features/schedule/types';

type StatusChangeMenuProps = {
    currentStatus: EditableSlotStatus;
    position: {
        x: number;
        y: number;
    };
    onSelect: (status: EditableSlotStatus) => void;
    onClose: () => void;
};

export function StatusChangeMenu({ currentStatus, position, onSelect, onClose }: StatusChangeMenuProps) {
    return (
        <div className="fixed inset-0 z-40" role="presentation" onClick={onClose}>
            <div
                className="absolute min-w-[122px] rounded-md bg-relink-white px-3 py-2 shadow-relink-card"
                style={{ left: position.x, top: position.y }}
                role="menu"
                aria-label="선택한 시간 상태 변경"
                onClick={(event) => event.stopPropagation()}
            >
                {editableStatusOrder
                    .filter((status) => status !== currentStatus)
                    .map((status) => (
                        <button
                            key={status}
                            type="button"
                            className="flex w-full items-center gap-2 rounded px-1 py-1.5 text-left font-display text-md text-relink-ink transition-colors hover:bg-relink-lavender-soft"
                            role="menuitem"
                            onClick={() => onSelect(status)}
                        >
                            <span
                                className={`h-5 w-5 shrink-0 rounded ${statusConfig[status].cellClassName}`}
                                aria-hidden="true"
                            />
                            <span>{statusConfig[status].label}로 변경</span>
                        </button>
                    ))}
            </div>
        </div>
    );
}
