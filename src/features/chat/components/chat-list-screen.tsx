import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatGroupCreateDialog } from '@/features/chat/components/chat-group-create-dialog';
import { ChatRoomList } from '@/features/chat/components/chat-room-list';
import type { ChatRoom, ChatTabKey } from '@/features/chat/types';
import { routePaths } from '@/constants/route-paths';

type ChatListScreenProps = {
    rooms: ChatRoom[];
    tab: ChatTabKey;
    isLoading?: boolean;
    errorMessage?: string | null;
};

const tabFilters: Record<ChatTabKey, (room: ChatRoom) => boolean> = {
    group: (room) => room.kind === 'group',
    direct: (room) => room.kind === 'direct',
    appointment: (room) => room.kind === 'appointment',
    unread: (room) => Boolean(room.unreadCount),
    all: () => true,
};

export function ChatListScreen({ rooms, tab, isLoading, errorMessage }: ChatListScreenProps) {
    const navigate = useNavigate();
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const filteredRooms = rooms.filter(tabFilters[tab]);

    return (
        <div className="relative flex h-full min-h-0 flex-col bg-relink-white">
            <ChatHeader onCreateGroup={() => setIsCreateGroupOpen(true)} />
            {isLoading ? (
                <p className="py-10 text-center font-display text-sm text-relink-gray-400">채팅방을 불러오는 중</p>
            ) : errorMessage ? (
                <p className="px-7 py-10 text-center font-display text-sm text-relink-gray-400">{errorMessage}</p>
            ) : filteredRooms.length === 0 ? (
                <div className="flex min-h-0 flex-1 items-center justify-center px-7">
                    <p className="font-display text-lg text-relink-gray-400">채팅방이 없습니다</p>
                </div>
            ) : (
                <ChatRoomList rooms={filteredRooms} />
            )}
            <ChatGroupCreateDialog
                isOpen={isCreateGroupOpen}
                onClose={() => setIsCreateGroupOpen(false)}
                onCreated={(roomId, roomName) => {
                    setIsCreateGroupOpen(false);
                    navigate(routePaths.chatRoom(roomId), {
                        state: {
                            fallbackRoomKind: 'group',
                            fallbackRoomName: roomName,
                        },
                    });
                }}
            />
        </div>
    );
}
