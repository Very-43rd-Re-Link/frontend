import { FriendStatusProfile } from '@/components/common/friend-status';
import type { FriendListItem, FriendListProps } from '@/features/friends/types';

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

export function FriendList({ friends, sortLabel, referenceTime }: FriendListProps) {
    return (
        <section className="-mx-5 flex min-h-0 flex-1 flex-col overflow-hidden border-y border-relink-card bg-relink-white shadow-relink-card">
            <div className="flex items-center justify-between px-5 pt-3 font-display text-md text-gray-400">
                <span>정렬기준: {sortLabel}</span>
                <span>{referenceTime} 기준</span>
            </div>

            <div className="relink-hidden-scrollbar mt-5 flex min-h-0 flex-1 flex-col gap-9 overflow-y-auto px-5 pb-5">
                {friends.map((friend) => (
                    <FriendListRow key={friend.name} friend={friend} />
                ))}
            </div>
        </section>
    );
}
