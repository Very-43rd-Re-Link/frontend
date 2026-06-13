import { ActiveLightningBadge } from '@/features/home/components/friend/active-lightning-badge';
import { FriendStatusRing } from '@/features/home/components/friend/friend-status-ring';
import { GenericAvatar } from '@/components/common/nav/generic-avatar';
import { type RingSlots } from '@/features/home/constants/ring-colors';

type FriendStatusItemProps = {
  name: string;
  slots: RingSlots;
  isActive?: boolean;
  activeColor?: string;
};

export function FriendStatusItem({
  name,
  slots,
  isActive = false,
  activeColor = '#66f2f6',
}: FriendStatusItemProps) {
  return (
    <div className="flex h-[88px] basis-1/5 shrink-0 grow-0 flex-col items-center">
      <div className="relative">
        <FriendStatusRing slots={slots}>
          <GenericAvatar size={46} />
        </FriendStatusRing>
        {isActive && (
          <div className="absolute -right-1 -top-1">
            <ActiveLightningBadge color={activeColor} />
          </div>
        )}
      </div>
      <p className="mt-[3px] text-center font-display text-sm text-relink-ink">
        {name}
      </p>
    </div>
  );
}
