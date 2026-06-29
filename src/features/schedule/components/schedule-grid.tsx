import { hours, statusConfig, weekDayLabels } from '@/features/schedule/constants';
import { getSlotKey } from '@/features/schedule/schedule-utils';
import type { EditableSlotStatus, ScheduledBlock } from '@/features/schedule/types';

type ScheduleGridProps = {
    weekDates: Date[];
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
    onSlotClick: (dayIndex: number, hour: number) => void;
};

export function ScheduleGrid({ weekDates, slotStatuses, scheduledSlotMap, onSlotClick }: ScheduleGridProps) {
    return (
        <section
            className="rounded bg-relink-white px-3 pb-4 pt-3 shadow-relink-card"
            style={{ height: 'min(720px, calc(100dvh - 290px))', minHeight: 600 }}
        >
            <div
                className="grid h-full gap-x-1 gap-y-1"
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
                        onSlotClick={onSlotClick}
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
    onSlotClick,
}: {
    hour: number;
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
    onSlotClick: (dayIndex: number, hour: number) => void;
}) {
    return (
        <>
            <div className="flex items-start justify-center pt-1 text-md text-relink-ink">{hour}</div>
            {weekDayLabels.map((_, dayIndex) => {
                const slotKey = getSlotKey(dayIndex, hour);
                const scheduledBlock = scheduledSlotMap.get(slotKey);
                const status = scheduledBlock ? 'scheduled' : (slotStatuses[slotKey] ?? 'available');
                const isBlockStart = scheduledBlock?.startHour === hour;

                return (
                    <button
                        key={slotKey}
                        type="button"
                        onClick={() => onSlotClick(dayIndex, hour)}
                        className={`relative min-h-0 w-full rounded transition-transform active:scale-95 ${statusConfig[status].cellClassName}`}
                        aria-label={`${weekDayLabels[dayIndex]}요일 ${hour}시 ${statusConfig[status].label}`}
                        disabled={status === 'scheduled'}
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
