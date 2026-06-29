import type { AvailabilitySegmentStatus } from '@/features/schedule/components/appointment-friend-types';

type AvailabilityBarProps = {
    availability: AvailabilitySegmentStatus[];
};

const segmentClassNames: Record<AvailabilitySegmentStatus, string> = {
    available: 'bg-relink-scheduleGreen',
    adjustable: 'bg-relink-scheduleYellow',
    unavailable: 'bg-relink-schedulePink',
    lightning: 'bg-relink-cyan',
    empty: 'bg-relink-lavender-middle/55',
};

export function AvailabilityBar({ availability }: AvailabilityBarProps) {
    return (
        <div className="mt-1 grid h-2 grid-cols-8 gap-[2px]" aria-hidden="true">
            {availability.map((status, index) => (
                <span key={`${status}-${index}`} className={`rounded-sm ${segmentClassNames[status]}`} />
            ))}
        </div>
    );
}
