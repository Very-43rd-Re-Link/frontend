import { GenericAvatar } from '@/components/generic-avatar';
import { type RingColor } from '@/features/home/constants/ring-colors';
import { FriendStatusRing } from '@/features/home/components/friend-status-ring';

type FriendStatusItemProps =
  | {
      name: string;
      colors: readonly RingColor[];
      avatar?: never;
    }
  | {
      name: string;
      avatar: true;
      colors?: never;
    };

export function FriendStatusItem(props: FriendStatusItemProps) {
  return (
    <div className="flex w-14 flex-col items-center">
      {'avatar' in props ? <GenericAvatar size={40} /> : <FriendStatusRing colors={props.colors} />}
      <p className="mt-[3px] text-center font-display text-[8px] leading-[10px] text-relink-ink">
        {props.name}
      </p>
    </div>
  );
}
