import { FriendOverviewHeader } from '@/features/home/components/friend-overview-header';
import { FriendStatusItem } from '@/features/home/components/friend-status-item';

const friends = [
    { name: '김가영', colors: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'] },
    { name: '김다영', colors: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'] },
    {
        name: '김마영',
        colors: ['cyan', 'cyan', 'cyan', 'yellow', 'yellow', 'yellow', 'cyan', 'cyan'],
    },
    {
        name: '김사영',
        colors: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
    },
] as const;

const FriendOverviewCard = () => {
    return (
        <section className="h-[125px] rounded-[10px] border border-relink-card bg-relink-white px-[13px] pt-[13px] shadow-relink-card">
            <FriendOverviewHeader />

            <div className="flex flex-1 items-start justify-between px-[5px] pt-[3px]">
                {friends.map((friend) => (
                    <FriendStatusItem key={friend.name} name={friend.name} colors={friend.colors} />
                ))}
                <FriendStatusItem name="김자영" avatar />
            </div>
        </section>
    );
};

export { FriendOverviewCard };
