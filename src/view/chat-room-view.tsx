import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { fetchChatMessages, fetchChatRooms, sendChatMessage } from '@/api/chat';
import { routePaths } from '@/constants/route-paths';
import { ChatRoomScreen } from '@/features/chat/components/chat-room-screen';
import type { ChatMessage, ChatRoom } from '@/features/chat/types';

export function ChatRoomView() {
    const { roomId } = useParams();
    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const loadMessages = useCallback(async () => {
        if (!roomId) {
            return;
        }

        const nextMessages = await fetchChatMessages(roomId);
        setMessages(nextMessages);
    }, [roomId]);

    useEffect(() => {
        let isMounted = true;

        async function loadRoom() {
            if (!roomId) {
                setNotFound(true);
                return;
            }

            setIsLoading(true);
            try {
                const rooms = await fetchChatRooms();
                const currentRoom = rooms.find((chatRoom) => chatRoom.id === roomId);

                if (!isMounted) {
                    return;
                }

                if (!currentRoom) {
                    setNotFound(true);
                    return;
                }

                setRoom(currentRoom);
                const nextMessages = await fetchChatMessages(roomId);
                if (isMounted) {
                    setMessages(nextMessages);
                }
            } catch {
                if (isMounted) {
                    setNotFound(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadRoom();

        return () => {
            isMounted = false;
        };
    }, [roomId]);

    if (notFound || !roomId) {
        return <Navigate to={routePaths.chat} replace />;
    }

    const roomWithMessages = room ?? {
        id: roomId,
        kind: 'group' as const,
        name: '',
        timeLabel: '',
        lastMessage: '',
        messages,
    };

    return (
        <ChatRoomScreen
            room={{ ...roomWithMessages, messages }}
            isLoading={isLoading}
            onSend={async (payload) => {
                await sendChatMessage({ roomId, ...payload });
                await loadMessages();
            }}
        />
    );
}
