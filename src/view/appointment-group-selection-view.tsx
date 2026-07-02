import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchChatRoomParticipants, fetchChatRooms } from '@/api/chat';
import { routePaths } from '@/constants/route-paths';
import { AppointmentGroupConfirmButton } from '@/features/schedule/components/appointment-group-confirm-button';
import type { AppointmentGroup } from '@/features/schedule/components/appointment-group-data';
import { AppointmentGroupHeader } from '@/features/schedule/components/appointment-group-header';
import { AppointmentGroupList } from '@/features/schedule/components/appointment-group-list';

export function AppointmentGroupSelectionView() {
    const navigate = useNavigate();
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [groups, setGroups] = useState<AppointmentGroup[]>([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasGroupLoadError, setHasGroupLoadError] = useState(false);
    const selectedGroup = useMemo(
        () => groups.find((group) => group.id === selectedGroupId),
        [groups, selectedGroupId],
    );

    useEffect(() => {
        let ignore = false;

        fetchChatRooms()
            .then((rooms) => {
                if (!ignore) {
                    setGroups(rooms.filter((room) => room.kind === 'group').map(toAppointmentGroup));
                }
            })
            .catch(() => {
                if (!ignore) {
                    setGroups([]);
                    setHasGroupLoadError(true);
                }
            })
            .finally(() => {
                if (!ignore) {
                    setIsLoadingGroups(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    const handleConfirm = async () => {
        if (!selectedGroup) {
            return;
        }

        setIsSubmitting(true);
        try {
            const participants = await fetchChatRoomParticipants(selectedGroup.id);
            navigate(routePaths.appointmentFriends, {
                state: {
                    initialSelectedFriendIds: participants.map((participant) => participant.memberId),
                    skipFriendSelection: true,
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="relative flex h-full min-h-0 flex-col bg-relink-white px-5 pt-10 font-display">
            <AppointmentGroupHeader onBack={() => navigate(routePaths.home)} />
            <AppointmentGroupContent
                groups={groups}
                isLoading={isLoadingGroups}
                hasError={hasGroupLoadError}
                selectedGroupId={selectedGroupId}
                onSelectGroup={setSelectedGroupId}
            />
            <AppointmentGroupConfirmButton
                isVisible={Boolean(selectedGroup) && !isSubmitting}
                onConfirm={() => {
                    void handleConfirm();
                }}
            />
        </main>
    );
}

function AppointmentGroupContent({
    groups,
    isLoading,
    hasError,
    selectedGroupId,
    onSelectGroup,
}: {
    groups: AppointmentGroup[];
    isLoading: boolean;
    hasError: boolean;
    selectedGroupId: string | null;
    onSelectGroup: (groupId: string) => void;
}) {
    if (isLoading) {
        return <AppointmentGroupStateMessage title="그룹 채팅방을 불러오는 중" />;
    }

    if (hasError) {
        return <AppointmentGroupStateMessage title="그룹 채팅방을 불러오지 못했어요" />;
    }

    if (groups.length === 0) {
        return <AppointmentGroupStateMessage title="참여 중인 그룹 채팅방이 없어요" />;
    }

    return (
        <AppointmentGroupList
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={onSelectGroup}
        />
    );
}

function AppointmentGroupStateMessage({ title }: { title: string }) {
    return (
        <section className="flex min-h-0 flex-1 items-center justify-center pb-20 text-center">
            <p className="text-lg text-relink-gray-400">{title}</p>
        </section>
    );
}

function toAppointmentGroup(room: { id: string; name: string; lastMessage: string; unreadCount?: number }): AppointmentGroup {
    return {
        id: room.id,
        name: room.name,
        previewText: room.lastMessage || '최근 메시지가 없어요',
    };
}
