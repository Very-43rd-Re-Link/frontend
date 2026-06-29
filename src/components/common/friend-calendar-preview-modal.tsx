import { hours, weekDayLabels } from '@/features/schedule/constants';

export type PreviewSlotStatus = 'scheduled' | 'unavailable' | 'adjustable' | 'available';

export type FriendCalendarPreviewBlock = {
    dayIndex: number;
    start: number;
    end: number;
    status: PreviewSlotStatus;
};

type FriendCalendarPreviewModalProps = {
    friendNames: string[];
    onClose: () => void;
};

export const previewDates = [4, 5, 6, 7, 8, 9, 10];

const singleFriendBlocks: FriendCalendarPreviewBlock[] = [
    { dayIndex: 0, start: 8, end: 16, status: 'unavailable' },
    { dayIndex: 0, start: 22, end: 24, status: 'available' },
    { dayIndex: 1, start: 22, end: 24, status: 'adjustable' },
    { dayIndex: 2, start: 16, end: 19, status: 'unavailable' },
    { dayIndex: 2, start: 19, end: 24, status: 'available' },
    { dayIndex: 4, start: 17.5, end: 20, status: 'adjustable' },
    { dayIndex: 4, start: 20, end: 24, status: 'available' },
    { dayIndex: 5, start: 18, end: 24, status: 'available' },
    { dayIndex: 6, start: 8, end: 16, status: 'available' },
    { dayIndex: 6, start: 16, end: 19, status: 'adjustable' },
    { dayIndex: 6, start: 22, end: 24, status: 'available' },
];

export const multipleFriendBlocks: FriendCalendarPreviewBlock[] = [
    { dayIndex: 0, start: 8, end: 10.5, status: 'available' },
    { dayIndex: 0, start: 11, end: 16, status: 'scheduled' },
    { dayIndex: 0, start: 22, end: 24, status: 'available' },
    { dayIndex: 1, start: 22, end: 24, status: 'scheduled' },
    { dayIndex: 2, start: 16, end: 19, status: 'available' },
    { dayIndex: 2, start: 19, end: 21, status: 'unavailable' },
    { dayIndex: 2, start: 21, end: 21.5, status: 'available' },
    { dayIndex: 2, start: 22, end: 22.5, status: 'unavailable' },
    { dayIndex: 2, start: 22.5, end: 23, status: 'available' },
    { dayIndex: 2, start: 23, end: 24, status: 'unavailable' },
    { dayIndex: 4, start: 17.5, end: 20, status: 'available' },
    { dayIndex: 4, start: 20, end: 24, status: 'unavailable' },
    { dayIndex: 5, start: 18, end: 20, status: 'unavailable' },
    { dayIndex: 5, start: 20, end: 21, status: 'unavailable' },
    { dayIndex: 5, start: 21, end: 21.5, status: 'adjustable' },
    { dayIndex: 5, start: 21.5, end: 22, status: 'scheduled' },
    { dayIndex: 5, start: 22, end: 24, status: 'unavailable' },
    { dayIndex: 6, start: 8, end: 10.5, status: 'unavailable' },
    { dayIndex: 6, start: 11, end: 14, status: 'available' },
    { dayIndex: 6, start: 14.5, end: 16, status: 'unavailable' },
    { dayIndex: 6, start: 16, end: 18, status: 'scheduled' },
    { dayIndex: 6, start: 22, end: 24, status: 'unavailable' },
];

const singleStatusClassNames: Record<PreviewSlotStatus, string> = {
    scheduled: 'bg-relink-lavender-intense',
    unavailable: 'bg-relink-schedulePink',
    adjustable: 'bg-relink-scheduleYellow',
    available: 'bg-relink-scheduleGreen',
};

export const multipleStatusClassNames: Record<PreviewSlotStatus, string> = {
    scheduled: 'bg-relink-scheduleGreen/35',
    unavailable: 'bg-relink-scheduleGreen/60',
    adjustable: 'bg-relink-scheduleGreen/75',
    available: 'bg-relink-scheduleGreen',
};

export function FriendCalendarPreviewModal({ friendNames, onClose }: FriendCalendarPreviewModalProps) {
    const isMultiple = friendNames.length > 1;
    const blocks = isMultiple ? multipleFriendBlocks : singleFriendBlocks;
    const statusClassNames = isMultiple ? multipleStatusClassNames : singleStatusClassNames;
    const title = isMultiple ? `${friendNames.length}명 친구 캘린더` : `${friendNames[0]} 캘린더`;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-3"
            role="presentation"
            onClick={onClose}
        >
            <article
                className="w-full max-w-[398px] rounded-md bg-relink-white px-5 pb-5 pt-7 font-display"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(event) => event.stopPropagation()}
            >
                <FriendCalendarPreviewGrid blocks={blocks} statusClassNames={statusClassNames} />
                <p className="mt-5 text-sm text-relink-gray-400">*나의 일정에서 가능/조율로 표시한 시간대만 표시돼요.</p>
            </article>
        </div>
    );
}

function FriendCalendarPreviewGrid({
    blocks,
    statusClassNames,
}: {
    blocks: FriendCalendarPreviewBlock[];
    statusClassNames: Record<PreviewSlotStatus, string>;
}) {
    return (
        <section
            className="grid h-[580px] gap-x-1"
            style={{
                gridTemplateColumns: '28px repeat(7, minmax(0, 1fr))',
                gridTemplateRows: '34px repeat(32, minmax(0, 1fr))',
            }}
        >
            <div aria-hidden="true" />
            {weekDayLabels.map((label, index) => (
                <div key={label} className="flex items-center justify-center gap-2">
                    <span className="text-md text-relink-ink">{label}</span>
                    <span className="text-sm text-relink-gray-400">{previewDates[index]}</span>
                </div>
            ))}

            {hours.map((hour) => (
                <div
                    key={hour}
                    className="col-start-1 flex items-start justify-center pt-0.5 text-md text-relink-ink"
                    style={{ gridRow: `${getSlotRow(hour)} / span 2` }}
                >
                    {hour}
                </div>
            ))}

            {blocks.map((block, index) => (
                <div
                    key={`${block.dayIndex}-${block.start}-${block.end}-${index}`}
                    className={`rounded ${statusClassNames[block.status]}`}
                    style={{
                        gridColumn: block.dayIndex + 2,
                        gridRow: `${getSlotRow(block.start)} / ${getSlotRow(block.end)}`,
                    }}
                    aria-label={`${weekDayLabels[block.dayIndex]}요일 ${formatTime(block.start)}부터 ${formatTime(block.end)}까지`}
                />
            ))}
        </section>
    );
}

export function getSlotRow(time: number) {
    return 2 + Math.round((time - 8) * 2);
}

function formatTime(time: number) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0 ? '00' : '30';

    return `${String(hour).padStart(2, '0')}:${minute}`;
}
