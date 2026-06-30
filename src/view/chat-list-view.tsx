import { useEffect, useState } from 'react';

import { fetchChatRooms } from '@/api/chat';
import { ChatListScreen } from '@/features/chat/components/chat-list-screen';
import type { ChatRoom, ChatTabKey } from '@/features/chat/types';

type ChatListViewProps = {
    tab: ChatTabKey;
};

export function ChatListView({ tab }: ChatListViewProps) {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadRooms() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const nextRooms = await fetchChatRooms();
                if (isMounted) {
                    setRooms(nextRooms);
                }
            } catch {
                if (isMounted) {
                    setErrorMessage('Failed to load chats.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadRooms();

        return () => {
            isMounted = false;
        };
    }, []);

    return <ChatListScreen rooms={rooms} tab={tab} isLoading={isLoading} errorMessage={errorMessage} />;
}
