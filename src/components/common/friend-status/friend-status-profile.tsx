import { ActiveLightningBadge } from '@/components/common/friend-status/active-lightning-badge';
import { FriendStatusRing } from '@/components/common/friend-status/friend-status-ring';
import { type RingSlots } from '@/components/common/friend-status/ring-colors';
import { GenericAvatar } from '@/components/common/nav/generic-avatar';

type FriendStatusProfileProps = {
    slots: RingSlots;
    isActive?: boolean;
    activeColor?: string;
    size?: number;
};

export function FriendStatusProfile({
    slots,
    isActive = false,
    activeColor = '#66f2f6',
    size = 64,
}: FriendStatusProfileProps) {
    const avatarSize = Math.round(size * 0.72);
    const badgeScale = size / 64;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <FriendStatusRing slots={slots} size={size}>
                <GenericAvatar size={avatarSize} />
            </FriendStatusRing>
            {isActive && (
                <div
                    className="absolute -right-1 -top-1 origin-top-right"
                    style={{ transform: `scale(${badgeScale})` }}
                >
                    <ActiveLightningBadge color={activeColor} />
                </div>
            )}
        </div>
    );
}
