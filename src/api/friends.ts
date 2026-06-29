import type { RingSlots } from '@/components/common/friend-status';
import type { FriendListItem, FriendOverview } from '@/features/friends/types';
import apiClient from '@/lib/api-client';

type ApiSlotStatus = 'UNAVAILABLE' | 'NEGOTIABLE' | 'AVAILABLE' | 'APPOINTMENT';

type FriendSummaryResponse = {
    memberId: number;
    name: string;
    imageUrl: string | null;
};

type FriendListResponse = {
    totalCount: number;
    page: number;
    size: number;
    hasNext: boolean;
    friends: FriendSummaryResponse[];
};

type RecommendedFriendListResponse = {
    friends: FriendSummaryResponse[];
};

type FriendStatusListResponse = {
    from: string;
    to: string;
    friends: FriendStatusResponse[];
};

type FriendStatusResponse = {
    memberId: number;
    active: boolean;
    slots: FriendStatusSlotResponse[];
};

type FriendStatusSlotResponse = {
    date: string;
    startTime: string;
    endTime: string;
    status: ApiSlotStatus;
    appointmentId: number | null;
};

export type FriendStatusMap = Map<number, {
    slots: RingSlots;
    isActive?: boolean;
    activeColor?: string;
    status: string;
}>;

export async function fetchFriends({
    keyword,
    page = 0,
    size = 20,
}: {
    keyword?: string;
    page?: number;
    size?: number;
} = {}) {
    const response = await apiClient.get<FriendListResponse>('/friends', {
        params: {
            keyword: keyword?.trim() || undefined,
            page,
            size,
        },
    });

    return {
        ...response,
        friends: response.friends.map(toFriendListItem),
    };
}

export async function fetchRecommendedFriends(limit = 10) {
    const response = await apiClient.get<RecommendedFriendListResponse>('/friends/recommendations', {
        params: { limit },
    });

    return response.friends.map(toFriendOverview);
}

export async function fetchFriendStatuses(memberIds: number[]) {
    if (memberIds.length === 0) {
        return new Map();
    }

    const response = await apiClient.get<FriendStatusListResponse>('/friends/status', {
        params: { memberIds: memberIds.slice(0, 10).join(',') },
    });

    return response.friends.reduce<FriendStatusMap>((statusMap, friend) => {
        statusMap.set(friend.memberId, {
            slots: friend.slots.map((slot) => toRingSlot(slot.status)),
            isActive: friend.active,
            activeColor: '#66f2f6',
            status: toStatusText(friend.active, friend.slots),
        });

        return statusMap;
    }, new Map());
}

function toFriendOverview(friend: FriendSummaryResponse): FriendOverview {
    return {
        memberId: friend.memberId,
        name: friend.name,
        imageUrl: friend.imageUrl,
        slots: [],
    };
}

function toFriendListItem(friend: FriendSummaryResponse): FriendListItem {
    return {
        ...toFriendOverview(friend),
        status: '상태를 불러오는 중',
    };
}

function toRingSlot(status: ApiSlotStatus): RingSlots[number] {
    switch (status) {
        case 'APPOINTMENT':
            return 'cyan';
        case 'NEGOTIABLE':
            return 'yellow';
        case 'AVAILABLE':
            return 'green';
        case 'UNAVAILABLE':
        default:
            return undefined;
    }
}

function toStatusText(active: boolean, slots: FriendStatusSlotResponse[]) {
    const availableSlotCount = slots.filter((slot) => slot.status !== 'UNAVAILABLE').length;
    const minutes = availableSlotCount * 30;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const duration = [
        hour > 0 ? `${hour}시간` : '',
        minute > 0 ? `${minute}분` : '',
    ].filter(Boolean).join(' ') || '0분';

    return `${active ? '번개 가능' : '지금 가능'} ~ ${duration}`;
}
