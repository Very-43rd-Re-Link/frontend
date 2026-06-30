import { FriendStatusProfile } from '@/components/common/friend-status/friend-status-profile';
import { type RingSlots } from '@/components/common/friend-status/ring-colors';

type FriendStatusItemProps = {
    name: string;
    slots: RingSlots;
    isActive?: boolean;
    activeColor?: string;
    imageUrl?: string | null;
    onClick?: () => void;
};

export function FriendStatusItem({
    name,
    slots,
    isActive = false,
    activeColor = '#66f2f6',
    imageUrl,
    onClick,
}: FriendStatusItemProps) {
    const itemContent = (
        <>
            <FriendStatusProfile
                slots={slots}
                isActive={isActive}
                activeColor={activeColor}
                imageUrl={imageUrl}
            />
            <p className="mt-[3px] text-center font-display text-sm text-relink-ink">{name}</p>
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                className="flex h-[88px] basis-1/5 shrink-0 grow-0 cursor-pointer flex-col items-center bg-transparent p-0 text-inherit"
                onClick={onClick}
            >
                {itemContent}
            </button>
        );
    }

    return (
        <div className="flex h-[88px] basis-1/5 shrink-0 grow-0 flex-col items-center">
            {itemContent}
        </div>
    );
}
