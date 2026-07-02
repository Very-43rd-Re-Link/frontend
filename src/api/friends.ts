import type { RingSlots } from '@/components/common/friend-status';
import type { FriendListItem, FriendOverview } from '@/features/friends/types';
import type { AvailabilitySegmentStatus } from '@/features/schedule/components/appointment-friend-types';
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
    availability: AvailabilitySegmentStatus[];
    availableSlotCount: number;
    fromLabel: string;
    toLabel: string;
    isActive?: boolean;
    activeColor?: string;
    status: string;
}>;

export async function fetchFriends({
    keyword,
    page = 0,
    size = 10,
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

    const params = new URLSearchParams();
    memberIds.slice(0, 10).forEach((memberId) => params.append('memberIds', String(memberId)));

    const response = await apiClient.get<FriendStatusListResponse>('/friends/status', {
        params,
    });

    return response.friends.reduce<FriendStatusMap>((statusMap, friend) => {
        const availableSlotCount = friend.slots.filter(isAvailableSlot).length;
        statusMap.set(friend.memberId, {
            slots: friend.slots.map((slot) => toRingSlot(slot.status)),
            availability: friend.slots.map((slot) => toAvailabilitySegmentStatus(slot.status, friend.active)),
            availableSlotCount,
            fromLabel: toTimeLabel(response.from),
            toLabel: toTimeLabel(response.to),
            isActive: friend.active,
            activeColor: '#66f2f6',
            status: toStatusText(friend.active, availableSlotCount),
        });

        return statusMap;
    }, new Map());
}

export async function activateLightning(expiresAt: Date) {
    await apiClient.post<void, { expiresAt: string }>('/friends/lightning', {
        expiresAt: expiresAt.toISOString(),
    });
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

function toAvailabilitySegmentStatus(status: ApiSlotStatus, active: boolean): AvailabilitySegmentStatus {
    switch (status) {
        case 'AVAILABLE':
            return active ? 'lightning' : 'available';
        case 'NEGOTIABLE':
            return 'adjustable';
        case 'APPOINTMENT':
        case 'UNAVAILABLE':
        default:
            return 'unavailable';
    }
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

function isAvailableSlot(slot: FriendStatusSlotResponse) {
    return slot.status === 'AVAILABLE' || slot.status === 'NEGOTIABLE';
}

function toStatusText(active: boolean, availableSlotCount: number) {
    const minutes = availableSlotCount * 30;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const duration = [
        hour > 0 ? `${hour}시간` : '',
        minute > 0 ? `${minute}분` : '',
    ].filter(Boolean).join(' ') || '0분';

    return `${active ? '번개 가능' : '지금 가능'} ~ ${duration}`;
}

function toTimeLabel(dateTime: string) {
    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
        return dateTime.slice(11, 16);
    }

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${hour}:${minute}`;
}
