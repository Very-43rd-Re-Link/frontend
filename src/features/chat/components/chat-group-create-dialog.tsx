import { useEffect, useMemo, useState } from 'react';

import { createGroupChatRoom } from '@/api/chat';
import { fetchFriends } from '@/api/friends';
import type { FriendListItem } from '@/features/friends/types';

type ChatGroupCreateDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (roomId: string, roomName: string) => void;
};

const GROUP_FRIEND_LIMIT = 50;

export function ChatGroupCreateDialog({ isOpen, onClose, onCreated }: ChatGroupCreateDialogProps) {
    const [friends, setFriends] = useState<FriendListItem[]>([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        let isMounted = true;

        async function loadFriends() {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const response = await fetchFriends({ size: GROUP_FRIEND_LIMIT });
                if (isMounted) {
                    setFriends(response.friends);
                }
            } catch {
                if (isMounted) {
                    setErrorMessage('친구 목록을 불러오지 못했어요.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadFriends();

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            return;
        }

        setSelectedMemberIds([]);
        setTitle('');
        setErrorMessage('');
    }, [isOpen]);

    const selectedFriends = useMemo(
        () => friends.filter((friend) => selectedMemberIds.includes(friend.memberId)),
        [friends, selectedMemberIds],
    );

    const suggestedTitle = useMemo(() => {
        if (selectedFriends.length === 0) {
            return '새 그룹 대화';
        }

        const names = selectedFriends.map((friend) => friend.name);
        if (names.length <= 3) {
            return names.join(', ');
        }

        return `${names.slice(0, 2).join(', ')} 외 ${names.length - 2}명`;
    }, [selectedFriends]);

    const roomTitle = title.trim() || suggestedTitle;

    const toggleMember = (memberId: number) => {
        setSelectedMemberIds((current) =>
            current.includes(memberId)
                ? current.filter((selectedMemberId) => selectedMemberId !== memberId)
                : [...current, memberId],
        );
    };

    const handleCreate = async () => {
        if (selectedMemberIds.length < 2 || isCreating) {
            return;
        }

        setIsCreating(true);
        setErrorMessage('');

        try {
            const roomId = await createGroupChatRoom({
                title: roomTitle,
                participantMemberIds: selectedMemberIds,
            });
            onCreated(roomId, roomTitle);
        } catch {
            setErrorMessage('그룹 채팅방을 만들지 못했어요. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-20 flex items-end bg-black/30 px-4 pb-5 pt-16">
            <section className="flex max-h-full w-full flex-col rounded-lg bg-relink-white shadow-[0_12px_32px_rgba(40,42,80,0.18)]">
                <header className="shrink-0 border-b border-relink-card px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-display text-xl text-relink-ink">그룹 채팅 만들기</h2>
                        <button
                            type="button"
                            className="font-display text-sm text-relink-gray-400"
                            onClick={onClose}
                        >
                            닫기
                        </button>
                    </div>
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder={suggestedTitle}
                        className="mt-4 w-full rounded-lg bg-relink-lavender-soft px-4 py-3 font-display text-md text-relink-ink outline-none placeholder:text-relink-gray-400"
                    />
                </header>

                <div className="relink-hidden-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    {isLoading ? (
                        <p className="py-8 text-center font-display text-sm text-relink-gray-400">친구를 불러오는 중</p>
                    ) : friends.length === 0 ? (
                        <p className="py-8 text-center font-display text-sm text-relink-gray-400">초대할 친구가 없어요</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {friends.map((friend) => {
                                const isSelected = selectedMemberIds.includes(friend.memberId);

                                return (
                                    <button
                                        key={friend.memberId}
                                        type="button"
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left ${
                                            isSelected ? 'bg-relink-lavender-middle' : 'bg-relink-lavender-soft'
                                        }`}
                                        onClick={() => toggleMember(friend.memberId)}
                                    >
                                        {friend.imageUrl ? (
                                            <img
                                                src={friend.imageUrl}
                                                alt=""
                                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-relink-white font-display text-sm text-relink-lavender-intense">
                                                {friend.name.slice(0, 1)}
                                            </span>
                                        )}
                                        <span className="min-w-0 flex-1 truncate font-display text-md text-relink-ink">
                                            {friend.name}
                                        </span>
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-relink-lavender-intense font-display text-xs text-relink-lavender-intense">
                                            {isSelected ? '✓' : ''}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {errorMessage ? (
                        <p className="mt-4 font-display text-sm text-red-500">{errorMessage}</p>
                    ) : null}
                </div>

                <footer className="shrink-0 border-t border-relink-card px-5 py-4">
                    <button
                        type="button"
                        disabled={selectedMemberIds.length < 2 || isCreating}
                        className="w-full rounded-lg bg-relink-lavender-intense py-3 font-display text-md text-relink-white disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleCreate}
                    >
                        {isCreating
                            ? '만드는 중'
                            : selectedMemberIds.length < 2
                                ? '친구 2명 이상 선택'
                                : `${selectedMemberIds.length}명 초대해서 시작`}
                    </button>
                </footer>
            </section>
        </div>
    );
}
