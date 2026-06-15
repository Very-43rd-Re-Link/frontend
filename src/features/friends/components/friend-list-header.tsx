import type { FriendListHeaderProps } from '@/features/friends/types';

export function FriendListHeader({ friendsCount }: FriendListHeaderProps) {
    return (
        <div className="flex items-center justify-between font-display">
            <div className="flex items-end justify-between gap-1">
                <p className="text-2xl text-gray-700">친구</p>
                <p className="text-sm text-gray-400">{friendsCount}명</p>
            </div>

            <button
                type="button"
                className="rounded-lg bg-relink-lavender-middle px-2 py-1 text-sm text-gray-400"
            >
                차단 친구
            </button>
        </div>
    );
}
