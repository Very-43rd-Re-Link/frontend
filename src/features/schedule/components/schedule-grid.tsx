import type { PointerEvent } from 'react';

import { hours, statusConfig, weekDayLabels } from '@/features/schedule/constants';
import { getSlotKey } from '@/features/schedule/schedule-utils';
import type { EditableSlotStatus, ScheduledBlock, SlotStatus } from '@/features/schedule/types';

type ScheduleGridProps = {
    weekDates: Date[];
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
    selectedSlotKeys: Set<string>;
    onSlotClick: (dayIndex: number, hour: number) => void;
    onSlotPointerDown: (dayIndex: number, hour: number, event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onScheduledBlockClick: (scheduledBlock: ScheduledBlock) => void;
};

export function ScheduleGrid({
    weekDates,
    slotStatuses,
    scheduledSlotMap,
    selectedSlotKeys,
    onSlotClick,
    onSlotPointerDown,
    onSlotPointerMove,
    onSlotPointerUp,
    onScheduledBlockClick,
}: ScheduleGridProps) {
    return (
        <section
            className="rounded bg-relink-white px-3 pb-4 pt-3 shadow-relink-card"
            style={{ height: 'min(720px, calc(100dvh - 290px))', minHeight: 600 }}
        >
            <div
                className="grid h-full gap-x-1"
                style={{
                    gridTemplateColumns: '26px repeat(7, minmax(0, 1fr))',
                    gridTemplateRows: '34px repeat(16, minmax(0, 1fr))',
                }}
            >
                <div aria-hidden="true" />
                {weekDates.map((date, index) => (
                    <div key={date.toISOString()} className="flex items-center justify-center gap-1">
                        <span className="text-sm text-relink-ink">{weekDayLabels[index]}</span>
                        <span className="text-[11px] text-relink-gray-400">{date.getDate()}</span>
                    </div>
                ))}

                {hours.map((hour) => (
                    <HourRow
                        key={hour}
                        hour={hour}
                        slotStatuses={slotStatuses}
                        scheduledSlotMap={scheduledSlotMap}
                        selectedSlotKeys={selectedSlotKeys}
                        onSlotClick={onSlotClick}
                        onSlotPointerDown={onSlotPointerDown}
                        onSlotPointerMove={onSlotPointerMove}
                        onSlotPointerUp={onSlotPointerUp}
                        onScheduledBlockClick={onScheduledBlockClick}
                    />
                ))}
            </div>
        </section>
    );
}

function HourRow({
    hour,
    slotStatuses,
    scheduledSlotMap,
    selectedSlotKeys,
    onSlotClick,
    onSlotPointerDown,
    onSlotPointerMove,
    onSlotPointerUp,
    onScheduledBlockClick,
}: {
    hour: number;
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
    selectedSlotKeys: Set<string>;
    onSlotClick: (dayIndex: number, hour: number) => void;
    onSlotPointerDown: (dayIndex: number, hour: number, event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onScheduledBlockClick: (scheduledBlock: ScheduledBlock) => void;
}) {
    return (
        <>
            <div className="flex items-start justify-center pt-1 text-md text-relink-ink">{hour}</div>
            {weekDayLabels.map((_, dayIndex) => {
                const slotKey = getSlotKey(dayIndex, hour);
                const currentCell = getCellState(dayIndex, hour, slotStatuses, scheduledSlotMap);

                if (!currentCell) {
                    return null;
                }

                const { scheduledBlock, status } = currentCell;
                const previousCell = getCellState(dayIndex, hour - 1, slotStatuses, scheduledSlotMap);
                const nextCell = getCellState(dayIndex, hour + 1, slotStatuses, scheduledSlotMap);
                const connectsToPrevious = isConnectedCell(status, scheduledBlock, previousCell);
                const connectsToNext = isConnectedCell(status, scheduledBlock, nextCell);
                const isBlockStart = scheduledBlock?.startHour === hour;
                const radiusClassName = [
                    connectsToPrevious ? 'mt-0 rounded-t-none' : 'mt-1 rounded-t',
                    connectsToNext ? 'mb-0 rounded-b-none' : 'mb-1 rounded-b',
                ].join(' ');
                const selectedClassName = selectedSlotKeys.has(slotKey)
                    ? 'z-10 ring-2 ring-relink-ink/40 ring-inset'
                    : '';

                return (
                    <button
                        key={slotKey}
                        type="button"
                        data-day-index={dayIndex}
                        data-hour={hour}
                        onPointerDown={(event) => {
                            if (!scheduledBlock) {
                                onSlotPointerDown(dayIndex, hour, event);
                            }
                        }}
                        onPointerMove={onSlotPointerMove}
                        onPointerUp={onSlotPointerUp}
                        onClick={() => {
                            if (scheduledBlock) {
                                onScheduledBlockClick(scheduledBlock);
                                return;
                            }

                            onSlotClick(dayIndex, hour);
                        }}
                        className={`relative min-h-0 w-full touch-none transition-transform active:scale-95 ${radiusClassName} ${selectedClassName} ${statusConfig[status].cellClassName}`}
                        aria-label={`${weekDayLabels[dayIndex]}요일 ${hour}시 ${statusConfig[status].label}`}
                    >
                        {isBlockStart ? (
                            <span
                                className={`absolute left-1 top-1 max-w-[calc(100%-8px)] text-left text-[9px] leading-[11px] ${statusConfig[status].textClassName}`}
                            >
                                <span className="block truncate">{scheduledBlock.title}</span>
                                <span className="block truncate">{scheduledBlock.location}</span>
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </>
    );
}

function getCellState(
    dayIndex: number,
    hour: number,
    slotStatuses: Record<string, EditableSlotStatus>,
    scheduledSlotMap: Map<string, ScheduledBlock>,
): ScheduleCellState | null {
    if (!hours.includes(hour)) {
        return null;
    }

    const slotKey = getSlotKey(dayIndex, hour);
    const scheduledBlock = scheduledSlotMap.get(slotKey);

    return {
        scheduledBlock,
        status: scheduledBlock ? 'scheduled' : (slotStatuses[slotKey] ?? 'available'),
    };
}

type ScheduleCellState = {
    scheduledBlock?: ScheduledBlock;
    status: SlotStatus;
};

function isConnectedCell(
    status: SlotStatus,
    scheduledBlock: ScheduledBlock | undefined,
    adjacentCell: ScheduleCellState | null,
) {
    if (!adjacentCell || adjacentCell.status !== status) {
        return false;
    }

    if (status === 'scheduled') {
        return adjacentCell.scheduledBlock === scheduledBlock;
    }

    return true;
}
