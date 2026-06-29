import { AppointmentFriendFirstRow } from '@/features/schedule/components/appointment-friend-first-row';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type AppointmentFriendFirstListProps = {
    friends: AppointmentFriend[];
    selectedFriendNames: string[];
    onFriendToggle: (friendName: string) => void;
    onCalendarOpen: (friendName: string) => void;
};

export function AppointmentFriendFirstList({
    friends,
    selectedFriendNames,
    onFriendToggle,
    onCalendarOpen,
}: AppointmentFriendFirstListProps) {
    return (
        <section className="relink-hidden-scrollbar mt-7 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-7 pr-3">
            {friends.map((friend) => (
                <AppointmentFriendFirstRow
                    key={friend.name}
                    friend={friend}
                    isSelected={selectedFriendNames.includes(friend.name)}
                    onToggle={() => onFriendToggle(friend.name)}
                    onCalendarOpen={() => onCalendarOpen(friend.name)}
                />
            ))}
        </section>
    );
}
