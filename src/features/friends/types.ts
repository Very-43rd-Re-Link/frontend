import type { RingSlots } from '@/components/common/friend-status';

export type FriendOverview = {
    name: string;
    slots: RingSlots;
    isActive?: boolean;
    activeColor?: string;
};

export type FriendListItem = FriendOverview & {
    status: string;
};

export type FriendListHeaderProps = {
    friendsCount: number;
};

export type FriendDetailSectionProps = {
    memberName: string;
    friends: FriendOverview[];
};

export type FriendSearchBarProps = {
    label?: string;
};

export type FriendListProps = {
    friends: FriendListItem[];
    sortLabel: string;
    referenceTime: string;
};
