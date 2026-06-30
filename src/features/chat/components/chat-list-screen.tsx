import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatRoomList } from '@/features/chat/components/chat-room-list';
import type { ChatRoom, ChatTabKey } from '@/features/chat/types';

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
    const filteredRooms = rooms.filter(tabFilters[tab]);

    return (
        <div className="flex h-full min-h-0 flex-col bg-relink-white">
            <ChatHeader />
            {isLoading ? (
                <p className="py-10 text-center font-display text-sm text-relink-gray-400">Loading...</p>
            ) : errorMessage ? (
                <p className="px-7 py-10 text-center font-display text-sm text-relink-gray-400">{errorMessage}</p>
            ) : filteredRooms.length === 0 ? (
                <div className="flex min-h-0 flex-1 items-center justify-center px-7">
                    <p className="font-display text-lg text-relink-gray-400">채팅방이 없습니다</p>
                </div>
            ) : (
                <ChatRoomList rooms={filteredRooms} />
            )}
        </div>
    );
}
