import { FriendCalendarPreviewModal } from '@/components/common/friend-calendar-preview-modal';
import { toCalendarPreviewBlocks } from '@/features/schedule/components/appointment-calendar-utils';
import { AppointmentFriendFirstHeader } from '@/features/schedule/components/appointment-friend-first-header';
import { AppointmentFriendFirstList } from '@/features/schedule/components/appointment-friend-first-list';
import { AppointmentFriendFirstNextButton } from '@/features/schedule/components/appointment-friend-first-next-button';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type AppointmentFriendFirstSelectionScreenProps = {
    friends: AppointmentFriend[];
    selectedFriendIds: number[];
    calendarPreviewFriend: AppointmentFriend | null;
    calendarPreviewStatus: 'idle' | 'loading' | 'success' | 'error';
    friendLoadingStatus: 'loading' | 'success' | 'error';
    onFriendToggle: (memberId: number) => void;
    onCalendarOpen: (memberId: number) => void;
    onCalendarClose: () => void;
    onBack: () => void;
    onNext: () => void;
};

export function AppointmentFriendFirstSelectionScreen({
    friends,
    selectedFriendIds,
    calendarPreviewFriend,
    calendarPreviewStatus,
    friendLoadingStatus,
    onFriendToggle,
    onCalendarOpen,
    onCalendarClose,
    onBack,
    onNext,
}: AppointmentFriendFirstSelectionScreenProps) {
    const calendarPreviewBlocks = calendarPreviewFriend
        ? toCalendarPreviewBlocks([calendarPreviewFriend])
        : undefined;

    return (
        <main className="relative flex h-full min-h-0 flex-col bg-relink-white px-5 pt-10 font-display">
            <AppointmentFriendFirstHeader onBack={onBack} />
            <FriendSelectionContent
                friends={friends}
                selectedFriendIds={selectedFriendIds}
                friendLoadingStatus={friendLoadingStatus}
                onFriendToggle={onFriendToggle}
                onCalendarOpen={onCalendarOpen}
            />
            <AppointmentFriendFirstNextButton selectedCount={selectedFriendIds.length} onNext={onNext} />

            {calendarPreviewFriend ? (
                <FriendCalendarPreviewModal
                    friendNames={[calendarPreviewFriend.name]}
                    blocks={calendarPreviewBlocks}
                    status={calendarPreviewStatus}
                    onClose={onCalendarClose}
                />
            ) : null}
        </main>
    );
}

function FriendSelectionContent({
    friends,
    selectedFriendIds,
    friendLoadingStatus,
    onFriendToggle,
    onCalendarOpen,
}: {
    friends: AppointmentFriend[];
    selectedFriendIds: number[];
    friendLoadingStatus: 'loading' | 'success' | 'error';
    onFriendToggle: (memberId: number) => void;
    onCalendarOpen: (memberId: number) => void;
}) {
    if (friendLoadingStatus === 'loading') {
        return <FriendSelectionStateMessage title="친구 목록을 불러오는 중" />;
    }

    if (friendLoadingStatus === 'error') {
        return <FriendSelectionStateMessage title="친구 목록을 불러오지 못했어요" />;
    }

    if (friends.length === 0) {
        return <FriendSelectionStateMessage title="약속에 초대할 친구가 없어요" />;
    }

    return (
        <AppointmentFriendFirstList
            friends={friends}
            selectedFriendIds={selectedFriendIds}
            onFriendToggle={onFriendToggle}
            onCalendarOpen={onCalendarOpen}
        />
    );
}

function FriendSelectionStateMessage({ title }: { title: string }) {
    return (
        <section className="flex min-h-0 flex-1 items-center justify-center pb-16 text-center">
            <p className="text-lg text-relink-gray-400">{title}</p>
        </section>
    );
}
