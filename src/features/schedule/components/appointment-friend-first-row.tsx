import genericAvatarSvg from '@/assets/icons/generic-avatar.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { AppointmentFriend, AvailabilitySegmentStatus } from '@/features/schedule/components/appointment-friend-types';
import { statusClassNames } from '@/features/schedule/components/appointment-friend-first-utils';

type AppointmentFriendFirstRowProps = {
    friend: AppointmentFriend;
    isSelected: boolean;
    onToggle: () => void;
    onCalendarOpen: () => void;
};

export function AppointmentFriendFirstRow({
    friend,
    isSelected,
    onToggle,
    onCalendarOpen,
}: AppointmentFriendFirstRowProps) {
    return (
        <article className="grid grid-cols-[28px_54px_minmax(0,1fr)_82px] items-center gap-2">
            <button
                type="button"
                className={`h-6 w-6 rounded-full border-[3px] border-relink-lavender-intense transition-colors ${
                    isSelected ? 'bg-relink-lavender-intense' : 'bg-relink-white'
                }`}
                aria-label={`${friend.name} 선택`}
                aria-pressed={isSelected}
                onClick={onToggle}
            />
            <InlineSvgIcon svg={genericAvatarSvg} className="h-[54px] w-[54px]" />

            <div className="min-w-0 pt-1">
                <p className="truncate text-lg text-relink-gray-700">{friend.name}</p>
                <FriendAvailabilityTimeline availability={friend.availability} />
            </div>

            <button
                type="button"
                className="justify-self-end rounded-md bg-relink-lavender-soft px-2 py-1.5 text-[11px] leading-3 text-relink-gray-700"
                onClick={onCalendarOpen}
            >
                캘린더 보기
            </button>
        </article>
    );
}

function FriendAvailabilityTimeline({ availability }: { availability: AvailabilitySegmentStatus[] }) {
    return (
        <div className="mt-1">
            <div
                className="grid h-2.5 grid-cols-8 overflow-hidden rounded-sm"
                aria-hidden="true"
                style={{ columnGap: '2px' }}
            >
                {availability.map((status, index) => {
                    const previousStatus = availability[index - 1];
                    const nextStatus = availability[index + 1];
                    const connectsToPrevious = previousStatus === status;
                    const connectsToNext = nextStatus === status;
                    const marginClassName = connectsToPrevious ? '-ml-[2px]' : '';
                    const radiusClassName = [
                        connectsToPrevious ? 'rounded-l-none' : 'rounded-l-sm',
                        connectsToNext ? 'rounded-r-none' : 'rounded-r-sm',
                    ].join(' ');

                    return (
                        <span
                            key={`${status}-${index}`}
                            className={`${statusClassNames[status]} ${marginClassName} ${radiusClassName}`}
                        />
                    );
                })}
            </div>
            <div className="mt-0.5 flex justify-between text-sm text-relink-gray-400">
                <span>20:00</span>
                <span>24:30</span>
            </div>
        </div>
    );
}
