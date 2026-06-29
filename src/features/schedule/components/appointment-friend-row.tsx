import genericAvatarSvg from '@/assets/icons/generic-avatar.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { AvailabilityBar } from '@/features/schedule/components/availability-bar';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type AppointmentFriendRowProps = {
    friend: AppointmentFriend;
    isSelected: boolean;
    onToggle: () => void;
    onCalendarOpen: () => void;
};

export function AppointmentFriendRow({ friend, isSelected, onToggle, onCalendarOpen }: AppointmentFriendRowProps) {
    return (
        <article className="grid grid-cols-[22px_42px_minmax(0,1fr)] items-center gap-2">
            <button
                type="button"
                className={`flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-relink-lavender-intense transition-colors ${
                    isSelected ? 'bg-relink-lavender-intense' : 'bg-relink-white'
                }`}
                aria-label={`${friend.name} 선택`}
                aria-pressed={isSelected}
                onClick={onToggle}
            />
            <InlineSvgIcon svg={genericAvatarSvg} className="h-[42px] w-[42px]" />

            <div className="min-w-0">
                <div className="flex min-w-0 items-center justify-between gap-1.5">
                    <p className="truncate text-md text-relink-gray-700">{friend.name}</p>
                    <button
                        type="button"
                        className="shrink-0 rounded bg-relink-lavender-soft px-2 py-1 text-[10px] leading-3 text-relink-gray-700"
                        onClick={onCalendarOpen}
                    >
                        캘린더 보기
                    </button>
                </div>
                <AvailabilityBar availability={friend.availability} />
            </div>
        </article>
    );
}
