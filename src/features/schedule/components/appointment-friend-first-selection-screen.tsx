import { FriendCalendarPreviewModal } from '@/components/common/friend-calendar-preview-modal';
import { appointmentFriends } from '@/features/schedule/components/appointment-friend-data';
import { AppointmentFriendFirstHeader } from '@/features/schedule/components/appointment-friend-first-header';
import { AppointmentFriendFirstList } from '@/features/schedule/components/appointment-friend-first-list';
import { AppointmentFriendFirstNextButton } from '@/features/schedule/components/appointment-friend-first-next-button';

type AppointmentFriendFirstSelectionScreenProps = {
    selectedFriendNames: string[];
    calendarPreviewName: string | null;
    onFriendToggle: (friendName: string) => void;
    onCalendarOpen: (friendName: string) => void;
    onCalendarClose: () => void;
    onNext: () => void;
};

export function AppointmentFriendFirstSelectionScreen({
    selectedFriendNames,
    calendarPreviewName,
    onFriendToggle,
    onCalendarOpen,
    onCalendarClose,
    onNext,
}: AppointmentFriendFirstSelectionScreenProps) {
    return (
        <main className="relative flex h-full min-h-0 flex-col bg-relink-white px-5 pt-10 font-display">
            <AppointmentFriendFirstHeader />
            <AppointmentFriendFirstList
                friends={appointmentFriends}
                selectedFriendNames={selectedFriendNames}
                onFriendToggle={onFriendToggle}
                onCalendarOpen={onCalendarOpen}
            />
            <AppointmentFriendFirstNextButton selectedCount={selectedFriendNames.length} onNext={onNext} />

            {calendarPreviewName ? (
                <FriendCalendarPreviewModal friendNames={[calendarPreviewName]} onClose={onCalendarClose} />
            ) : null}
        </main>
    );
}
