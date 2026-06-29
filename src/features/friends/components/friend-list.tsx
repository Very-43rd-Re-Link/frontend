import { useCallback, useEffect, useRef, useState, type UIEvent } from 'react';

import { fetchFriends } from '@/api/friends';
import {
    applyFriendStatuses,
    FriendStatusProfile,
    useFriendStatuses,
} from '@/components/common/friend-status';
import type { FriendListItem, FriendListProps } from '@/features/friends/types';

const FRIEND_PAGE_SIZE = 20;

function FriendListRow({ friend }: { friend: FriendListItem }) {
    return (
        <article className="flex items-center gap-4">
            <FriendStatusProfile
                slots={friend.slots}
                isActive={friend.isActive}
                activeColor={friend.activeColor}
            />

            <div className="min-w-0 flex-1">
                <p className="font-display text-lg text-relink-ink">{friend.name}</p>
                <p className="mt-1 truncate font-display text-sm text-gray-400">{friend.status}</p>
            </div>

            <div className="flex shrink-0 gap-2">
                <button
                    type="button"
                    className="rounded-md bg-relink-lavender-soft px-4 py-2 font-display text-sm text-gray-700"
                >
                    1:1 채팅
                </button>
                <button
                    type="button"
                    className="rounded-md bg-relink-lavender-soft px-4 py-2 font-display text-sm text-gray-700"
                >
                    약속 잡기
                </button>
            </div>
        </article>
    );
}

export function FriendList({
    keyword,
    sortLabel,
    referenceTime,
    onFriendsCountChange,
}: FriendListProps) {
    const [friends, setFriends] = useState<FriendListItem[]>([]);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);
    const isLoadingFriendsRef = useRef(false);
    const {
        statusMap,
        isLoadingStatuses,
        loadNextStatuses,
        resetStatuses,
    } = useFriendStatuses();

    const loadFriends = useCallback(async (nextPage: number, shouldReplace = false) => {
        isLoadingFriendsRef.current = true;
        setIsLoadingFriends(true);

        try {
            const response = await fetchFriends({
                keyword,
                page: nextPage,
                size: FRIEND_PAGE_SIZE,
            });

            setPage(response.page);
            setHasNext(response.hasNext);
            onFriendsCountChange?.(response.totalCount);

            setFriends((currentFriends) => {
                const nextFriends = shouldReplace
                    ? response.friends
                    : [...currentFriends, ...response.friends];

                void loadNextStatuses(nextFriends.map((friend) => friend.memberId));
                return nextFriends;
            });
        } finally {
            setIsLoadingFriends(false);
            isLoadingFriendsRef.current = false;
        }
    }, [keyword, loadNextStatuses, onFriendsCountChange]);

    useEffect(() => {
        resetStatuses();
        setFriends([]);
        void loadFriends(0, true);
    }, [keyword, loadFriends, resetStatuses]);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        const reachedBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 80;

        if (reachedBottom && !isLoadingFriendsRef.current) {
            if (hasNext) {
                void loadFriends(page + 1);
                return;
            }

            void loadNextStatuses(friends.map((friend) => friend.memberId));
        }
    };

    const friendsWithStatuses = applyFriendStatuses(friends, statusMap);

    return (
        <section className="-mx-5 flex min-h-0 flex-1 flex-col overflow-hidden border-y border-relink-card bg-relink-white shadow-relink-card">
            <div className="flex items-center justify-between px-5 pt-3 font-display text-md text-gray-400">
                <span>정렬기준: {sortLabel}</span>
                <span>{referenceTime} 기준</span>
            </div>

            <div
                className="relink-hidden-scrollbar mt-5 flex min-h-0 flex-1 flex-col gap-9 overflow-y-auto px-5 pb-5"
                onScroll={handleScroll}
            >
                {friendsWithStatuses.map((friend) => (
                    <FriendListRow key={friend.memberId} friend={friend} />
                ))}

                {(isLoadingFriends || isLoadingStatuses) && (
                    <p className="font-display text-sm text-gray-400">
                        {isLoadingFriends ? '친구 목록을 불러오는 중' : '친구 상태를 갱신하는 중'}
                    </p>
                )}
            </div>
        </section>
    );
}
