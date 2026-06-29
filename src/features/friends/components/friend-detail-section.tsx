import { useEffect, useState } from 'react';

import { fetchRecommendedFriends } from '@/api/friends';
import {
    applyFriendStatuses,
    FriendStatusItem,
    useFriendStatuses,
} from '@/components/common/friend-status';
import type { FriendDetailSectionProps, FriendOverview } from '@/features/friends/types';

export function FriendDetailSection({ memberName }: FriendDetailSectionProps) {
    const [friends, setFriends] = useState<FriendOverview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {
        statusMap,
        isLoadingStatuses,
        loadNextStatuses,
        resetStatuses,
    } = useFriendStatuses();

    useEffect(() => {
        let ignore = false;
        resetStatuses();

        async function loadRecommendedFriends() {
            setIsLoading(true);

            try {
                const recommendedFriends = await fetchRecommendedFriends(10);
                if (ignore) {
                    return;
                }

                setFriends(recommendedFriends);
                await loadNextStatuses(recommendedFriends.map((friend) => friend.memberId));
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        void loadRecommendedFriends();

        return () => {
            ignore = true;
        };
    }, [loadNextStatuses, resetStatuses]);

    const friendsWithStatuses = applyFriendStatuses(friends, statusMap);

    return (
        <section className="flex h-[142px] flex-none flex-col overflow-hidden rounded-[10px] border border-relink-card bg-relink-white p-3 shadow-relink-card">
            <div className="font-display text-lg">
                <span className="text-gray-700">{memberName}</span>
                <span className="text-gray-400">님을 위한 추천</span>
            </div>

            <div className="relink-hidden-scrollbar mt-1 flex h-[96px] items-start overflow-x-auto overflow-y-hidden pt-1">
                {friendsWithStatuses.map((friend) => (
                    <FriendStatusItem
                        key={friend.memberId}
                        name={friend.name}
                        slots={friend.slots}
                        isActive={friend.isActive}
                        activeColor={friend.activeColor}
                    />
                ))}
                {(isLoading || isLoadingStatuses) && (
                    <p className="font-display text-sm text-gray-400">추천 친구를 불러오는 중</p>
                )}
            </div>
        </section>
    );
}
