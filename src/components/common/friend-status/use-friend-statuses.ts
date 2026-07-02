import { useCallback, useEffect, useRef, useState } from 'react';

import {
    fetchFriendStatuses,
    type FriendStatusMap,
} from '@/api/friends';
import type { RingSlots } from '@/components/common/friend-status/ring-colors';
import type { AvailabilitySegmentStatus } from '@/features/schedule/components/appointment-friend-types';

const STATUS_BATCH_SIZE = 10;

type StatusTarget = {
    memberId: number;
    slots: RingSlots;
    isActive?: boolean;
    activeColor?: string;
    availability?: AvailabilitySegmentStatus[];
    availableSlotCount?: number;
    availabilityFromLabel?: string;
    availabilityToLabel?: string;
    imageUrl?: string | null;
    status?: string;
};

export function useFriendStatuses() {
    const [statusMap, setStatusMap] = useState<FriendStatusMap>(new Map());
    const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);
    const loadedMemberIdsRef = useRef(new Set<number>());

    const resetStatuses = useCallback(() => {
        loadedMemberIdsRef.current = new Set();
        setStatusMap(new Map());
    }, []);

    const refreshLoadedStatuses = useCallback(async () => {
        const loadedMemberIds = Array.from(loadedMemberIdsRef.current).slice(0, STATUS_BATCH_SIZE);

        if (loadedMemberIds.length === 0) {
            return;
        }

        setIsLoadingStatuses(true);
        try {
            const nextStatusMap = await fetchFriendStatuses(loadedMemberIds);
            setStatusMap((currentStatusMap) => {
                const mergedStatusMap = new Map(currentStatusMap);
                nextStatusMap.forEach((status, memberId) => {
                    mergedStatusMap.set(memberId, status);
                });
                return mergedStatusMap;
            });
        } finally {
            setIsLoadingStatuses(false);
        }
    }, []);

    const loadNextStatuses = useCallback(async (memberIds: number[]) => {
        const nextMemberIds = memberIds
            .filter((memberId) => !loadedMemberIdsRef.current.has(memberId))
            .slice(0, STATUS_BATCH_SIZE);

        if (nextMemberIds.length === 0) {
            return;
        }

        setIsLoadingStatuses(true);
        try {
            const nextStatusMap = await fetchFriendStatuses(nextMemberIds);
            nextMemberIds.forEach((memberId) => loadedMemberIdsRef.current.add(memberId));

            setStatusMap((currentStatusMap) => {
                const mergedStatusMap = new Map(currentStatusMap);
                nextStatusMap.forEach((status, memberId) => {
                    mergedStatusMap.set(memberId, status);
                });
                return mergedStatusMap;
            });
        } finally {
            setIsLoadingStatuses(false);
        }
    }, []);

    useEffect(() => {
        const handleLightningUpdated = () => {
            void refreshLoadedStatuses();
        };

        window.addEventListener('relink:lightning-updated', handleLightningUpdated);

        return () => {
            window.removeEventListener('relink:lightning-updated', handleLightningUpdated);
        };
    }, [refreshLoadedStatuses]);

    return {
        statusMap,
        isLoadingStatuses,
        loadNextStatuses,
        refreshLoadedStatuses,
        resetStatuses,
    };
}

export function applyFriendStatuses<T extends StatusTarget>(targets: T[], statusMap: FriendStatusMap): T[] {
    return targets.map((target) => {
        const status = statusMap.get(target.memberId);

        if (!status) {
            return target;
        }

        return {
            ...target,
            slots: status.slots,
            isActive: status.isActive,
            activeColor: status.activeColor,
            availability: status.availability,
            availableSlotCount: status.availableSlotCount,
            availabilityFromLabel: status.fromLabel,
            availabilityToLabel: status.toLabel,
            ...('status' in target ? { status: status.status } : {}),
        } as T;
    });
}
