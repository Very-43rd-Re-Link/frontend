import { FriendStatusItem } from '@/components/common/friend-status';
import type { FriendDetailSectionProps } from '@/features/friends/types';

export function FriendDetailSection({ memberName, friends }: FriendDetailSectionProps) {
    return (
        <section className="flex h-[142px] flex-none flex-col overflow-hidden rounded-[10px] border border-relink-card bg-relink-white p-3 shadow-relink-card">
            <div className="font-display text-lg">
                <span className="text-gray-700">{memberName}</span>
                <span className="text-gray-400">을 위한 추천</span>
            </div>

            <div className="relink-hidden-scrollbar mt-1 flex h-[96px] items-start overflow-x-auto overflow-y-hidden pt-1">
                {friends.map((friend) => (
                    <FriendStatusItem
                        key={friend.name}
                        name={friend.name}
                        slots={friend.slots}
                        isActive={friend.isActive}
                        activeColor={friend.activeColor}
                    />
                ))}
            </div>
        </section>
    );
}
