import { AppointmentFriendRow } from '@/features/schedule/components/appointment-friend-row';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type AppointmentFriendListProps = {
    friends: AppointmentFriend[];
    selectedFriendNames: string[];
    onFriendToggle: (friendName: string) => void;
    onCalendarOpen: (friendName: string) => void;
};

export function AppointmentFriendList({
    friends,
    selectedFriendNames,
    onFriendToggle,
    onCalendarOpen,
}: AppointmentFriendListProps) {
    return (
        <section className="relink-hidden-scrollbar mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-4">
            {friends.map((friend) => (
                <AppointmentFriendRow
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
