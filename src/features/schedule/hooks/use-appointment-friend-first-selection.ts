import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchAppointmentFriendCalendars } from '@/api/appointments';
import { fetchFriends, fetchFriendStatuses, type FriendStatusMap } from '@/api/friends';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';
import type { FriendFirstStep, TimeSlot } from '@/features/schedule/components/appointment-friend-first-utils';
import type { AppointmentSelection } from '@/features/schedule/types';

const FRIEND_STATUS_BATCH_SIZE = 10;

type AppointmentFriendFirstLocationState = {
    initialSelectedFriendIds?: unknown;
    initialSelectedFriendNames?: unknown;
    skipFriendSelection?: unknown;
};

type FriendLoadingStatus = 'loading' | 'success' | 'error';
type CalendarPreviewStatus = 'idle' | 'loading' | 'success' | 'error';

export function useAppointmentFriendFirstSelection(locationState: unknown) {
    const initialSelectedFriendIds = useMemo(() => getInitialSelectedFriendIds(locationState), [locationState]);
    const initialSelectedFriendNames = useMemo(() => getInitialSelectedFriendNames(locationState), [locationState]);
    const shouldSkipFriendSelection = useMemo(() => getShouldSkipFriendSelection(locationState), [locationState]);
    const [step, setStep] = useState<FriendFirstStep>(shouldSkipFriendSelection ? 'time' : 'friends');
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>(initialSelectedFriendIds);
    const [calendarPreviewMemberId, setCalendarPreviewMemberId] = useState<number | null>(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
    const [proposalSelection, setProposalSelection] = useState<AppointmentSelection | null>(null);
    const [friends, setFriends] = useState<AppointmentFriend[]>([]);
    const [calendarFriends, setCalendarFriends] = useState<AppointmentFriend[]>([]);
    const [friendLoadingStatus, setFriendLoadingStatus] = useState<FriendLoadingStatus>('loading');
    const [calendarPreviewStatus, setCalendarPreviewStatus] = useState<CalendarPreviewStatus>('idle');

    useEffect(() => {
        let ignore = false;

        async function loadFriendsWithStatuses() {
            try {
                const response = await fetchFriends({ size: 50 });
                if (ignore) {
                    return;
                }

                const loadedFriends = response.friends.map(toAppointmentFriend);
                setFriends(loadedFriends);
                setFriendLoadingStatus('success');

                if (initialSelectedFriendIds.length === 0 && initialSelectedFriendNames.length > 0) {
                    setSelectedFriendIds(resolveFriendIdsByNames(loadedFriends, initialSelectedFriendNames));
                }

                try {
                    const statusMap = await fetchFriendStatusesInBatches(toMemberIds(loadedFriends));
                    if (!ignore) {
                        setFriends((currentFriends) => sortAppointmentFriends(applyAppointmentFriendStatuses(currentFriends, statusMap)));
                    }
                } catch {
                    if (!ignore) {
                        setFriends((currentFriends) => sortAppointmentFriends(currentFriends));
                    }
                }
            } catch {
                if (!ignore) {
                    setFriends([]);
                    setFriendLoadingStatus('error');
                }
            }
        }

        void loadFriendsWithStatuses();

        return () => {
            ignore = true;
        };
    }, [initialSelectedFriendIds.length, initialSelectedFriendNames]);

    useEffect(() => {
        let ignore = false;

        if (selectedFriendIds.length === 0) {
            return () => {
                ignore = true;
            };
        }

        fetchAppointmentFriendCalendars(selectedFriendIds, new Date())
            .then((calendarFriends) => {
                if (!ignore) {
                    setCalendarFriends((currentFriends) => mergeCalendarFriends(currentFriends, calendarFriends));
                }
            })
            .catch(() => {
                if (!ignore) {
                    setCalendarFriends((currentFriends) => currentFriends);
                }
            });

        return () => {
            ignore = true;
        };
    }, [selectedFriendIds]);

    const friendsWithCalendars = useMemo(() => {
        if (calendarFriends.length === 0) {
            return friends;
        }

        const calendarByMemberId = new Map(calendarFriends.map((friend) => [friend.memberId, friend]));

        return friends.map((friend) => {
            const calendarFriend = friend.memberId ? calendarByMemberId.get(friend.memberId) : undefined;

            return calendarFriend ? { ...friend, calendar: calendarFriend.calendar } : friend;
        });
    }, [calendarFriends, friends]);

    const selectedFriends = useMemo(
        () => friendsWithCalendars.filter((friend) => isSelectedFriend(friend, selectedFriendIds)),
        [friendsWithCalendars, selectedFriendIds],
    );

    const calendarPreviewFriend = useMemo(
        () => friendsWithCalendars.find((friend) => friend.memberId === calendarPreviewMemberId) ?? null,
        [calendarPreviewMemberId, friendsWithCalendars],
    );

    const toggleFriend = useCallback((memberId: number) => {
        setSelectedFriendIds((currentIds) =>
            currentIds.includes(memberId)
                ? currentIds.filter((currentId) => currentId !== memberId)
                : [...currentIds, memberId],
        );
    }, []);

    const openCalendarPreview = useCallback((memberId: number) => {
        setCalendarPreviewMemberId(memberId);

        if (hasCalendar(calendarFriends, memberId)) {
            setCalendarPreviewStatus('success');
            return;
        }

        setCalendarPreviewStatus('loading');
        fetchAppointmentFriendCalendars([memberId], new Date())
            .then((calendarFriends) => {
                setCalendarFriends((currentFriends) => mergeCalendarFriends(currentFriends, calendarFriends));
                setCalendarPreviewStatus('success');
            })
            .catch(() => {
                setCalendarPreviewStatus('error');
            });
    }, [calendarFriends]);

    const closeCalendarPreview = useCallback(() => {
        setCalendarPreviewMemberId(null);
        setCalendarPreviewStatus('idle');
    }, []);

    return {
        step,
        setStep,
        shouldSkipFriendSelection,
        selectedFriendIds,
        selectedFriends,
        calendarPreviewFriend,
        calendarPreviewStatus,
        selectedTimeSlots,
        setSelectedTimeSlots,
        proposalSelection,
        setProposalSelection,
        friends: friendsWithCalendars,
        friendLoadingStatus,
        toggleFriend,
        openCalendarPreview,
        closeCalendarPreview,
    };
}

function getInitialSelectedFriendIds(state: unknown) {
    if (!isLocationState(state) || !Array.isArray(state.initialSelectedFriendIds)) {
        return [];
    }

    return state.initialSelectedFriendIds.filter(
        (memberId): memberId is number => typeof memberId === 'number',
    );
}

function getInitialSelectedFriendNames(state: unknown) {
    if (!isLocationState(state) || !Array.isArray(state.initialSelectedFriendNames)) {
        return [];
    }

    return state.initialSelectedFriendNames.filter(
        (friendName): friendName is string => typeof friendName === 'string',
    );
}

function getShouldSkipFriendSelection(state: unknown) {
    return Boolean(isLocationState(state) && state.skipFriendSelection);
}

function isLocationState(state: unknown): state is AppointmentFriendFirstLocationState {
    return Boolean(state && typeof state === 'object');
}

function resolveFriendIdsByNames(friends: AppointmentFriend[], friendNames: string[]) {
    const unresolvedNames = new Set(friendNames);

    return friends.flatMap((friend) => {
        if (typeof friend.memberId !== 'number' || !unresolvedNames.has(friend.name)) {
            return [];
        }

        unresolvedNames.delete(friend.name);
        return [friend.memberId];
    });
}

function isSelectedFriend(friend: AppointmentFriend, selectedFriendIds: number[]) {
    return typeof friend.memberId === 'number' && selectedFriendIds.includes(friend.memberId);
}

function hasCalendar(friends: AppointmentFriend[], memberId: number) {
    return friends.some((friend) => friend.memberId === memberId && friend.calendar);
}

function mergeCalendarFriends(currentFriends: AppointmentFriend[], nextFriends: AppointmentFriend[]) {
    const friendByMemberId = new Map(currentFriends.map((friend) => [friend.memberId, friend]));
    nextFriends.forEach((friend) => {
        if (typeof friend.memberId === 'number') {
            const currentFriend = friendByMemberId.get(friend.memberId);
            friendByMemberId.set(friend.memberId, currentFriend ? { ...currentFriend, calendar: friend.calendar } : friend);
        }
    });

    return [...friendByMemberId.values()];
}

async function fetchFriendStatusesInBatches(memberIds: number[]) {
    const statusMap: FriendStatusMap = new Map();

    for (let startIndex = 0; startIndex < memberIds.length; startIndex += FRIEND_STATUS_BATCH_SIZE) {
        const nextStatusMap = await fetchFriendStatuses(memberIds.slice(startIndex, startIndex + FRIEND_STATUS_BATCH_SIZE));
        nextStatusMap.forEach((status, memberId) => {
            statusMap.set(memberId, status);
        });
    }

    return statusMap;
}

function applyAppointmentFriendStatuses(friends: AppointmentFriend[], statusMap: FriendStatusMap) {
    return friends.map((friend) => {
        if (typeof friend.memberId !== 'number') {
            return friend;
        }

        const status = statusMap.get(friend.memberId);
        if (!status) {
            return friend;
        }

        return {
            ...friend,
            availability: status.availability,
            isActive: status.isActive,
            availableSlotCount: status.availableSlotCount,
            availabilityFromLabel: status.fromLabel,
            availabilityToLabel: status.toLabel,
        };
    });
}

function sortAppointmentFriends(friends: AppointmentFriend[]) {
    return [...friends].sort((first, second) => {
        const priorityDifference = getAppointmentFriendSortPriority(first) - getAppointmentFriendSortPriority(second);
        if (priorityDifference !== 0) {
            return priorityDifference;
        }

        const availableDifference = (second.availableSlotCount ?? 0) - (first.availableSlotCount ?? 0);
        if (availableDifference !== 0) {
            return availableDifference;
        }

        return first.name.localeCompare(second.name, 'ko');
    });
}

function toMemberIds(friends: AppointmentFriend[]) {
    return friends
        .map((friend) => friend.memberId)
        .filter((memberId): memberId is number => typeof memberId === 'number');
}

function getAppointmentFriendSortPriority(friend: AppointmentFriend) {
    const isActive = Boolean(friend.isActive);
    const hasAvailableTime = (friend.availableSlotCount ?? 0) > 0;

    if (isActive && hasAvailableTime) {
        return 0;
    }
    if (hasAvailableTime) {
        return 1;
    }
    if (isActive) {
        return 2;
    }
    return 3;
}

function toAppointmentFriend(friend: { memberId: number; name: string; imageUrl?: string | null }): AppointmentFriend {
    return {
        memberId: friend.memberId,
        name: friend.name,
        imageUrl: friend.imageUrl,
        availability: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'empty'],
    };
}
