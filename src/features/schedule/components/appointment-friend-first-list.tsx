import { AppointmentFriendFirstRow } from '@/features/schedule/components/appointment-friend-first-row';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type AppointmentFriendFirstListProps = {
    friends: AppointmentFriend[];
    selectedFriendIds: number[];
    onFriendToggle: (memberId: number) => void;
    onCalendarOpen: (memberId: number) => void;
};

export function AppointmentFriendFirstList({
    friends,
    selectedFriendIds,
    onFriendToggle,
    onCalendarOpen,
}: AppointmentFriendFirstListProps) {
    return (
        <section className="relink-hidden-scrollbar mt-7 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-7 pr-3">
            {friends.map((friend) => (
                <AppointmentFriendFirstRow
                    key={friend.memberId ?? friend.name}
                    friend={friend}
                    isSelected={typeof friend.memberId === 'number' && selectedFriendIds.includes(friend.memberId)}
                    onToggle={() => {
                        if (typeof friend.memberId === 'number') {
                            onFriendToggle(friend.memberId);
                        }
                    }}
                    onCalendarOpen={() => {
                        if (typeof friend.memberId === 'number') {
                            onCalendarOpen(friend.memberId);
                        }
                    }}
                />
            ))}
        </section>
    );
}
