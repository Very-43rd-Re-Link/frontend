import type { RingSlots } from '@/components/common/friend-status';

export type FriendOverview = {
    memberId: number;
    name: string;
    imageUrl?: string | null;
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
};

export type FriendSearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export type FriendListProps = {
    keyword: string;
    sortLabel: string;
    referenceTime: string;
    onFriendsCountChange?: (count: number) => void;
};
