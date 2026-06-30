import type { PointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { fetchAvailableAppointmentFriends } from '@/api/appointments';
import {
    FriendCalendarPreviewModal,
    type FriendCalendarPreviewBlock,
    type PreviewSlotStatus,
} from '@/components/common/friend-calendar-preview-modal';
import { appointmentFriends } from '@/features/schedule/components/appointment-friend-data';
import { AppointmentFriendList } from '@/features/schedule/components/appointment-friend-list';
import { AppointmentFriendSelectionHeader } from '@/features/schedule/components/appointment-friend-selection-header';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';
import type { AppointmentSelection } from '@/features/schedule/types';

type AppointmentFriendSelectionProps = {
    selection: AppointmentSelection;
    onDismiss: () => void;
    onNext: (selectedFriends: AppointmentFriend[]) => void;
};

type SheetDragState = {
    startY: number;
    startHeight: number;
};

const collapsedSheetHeight = 328;
const expandedSheetHeight = 540;
const dismissSheetHeight = 236;

export function AppointmentFriendSelection({ selection, onDismiss, onNext }: AppointmentFriendSelectionProps) {
    const [sheetHeight, setSheetHeight] = useState(collapsedSheetHeight);
    const [selectedFriendNames, setSelectedFriendNames] = useState<string[]>([]);
    const [calendarPreviewNames, setCalendarPreviewNames] = useState<string[] | null>(null);
    const [availableFriends, setAvailableFriends] = useState<AppointmentFriend[]>(appointmentFriends);
    const dragStateRef = useRef<SheetDragState | null>(null);
    const hasSelectedFriends = selectedFriendNames.length > 0;
    const selectedFriends = availableFriends.filter((friend) => selectedFriendNames.includes(friend.name));
    const calendarPreviewBlocks = calendarPreviewNames
        ? toCalendarPreviewBlocks(availableFriends.filter((friend) => calendarPreviewNames.includes(friend.name)))
        : undefined;

    useEffect(() => {
        let ignore = false;

        if (!selection.startAt || !selection.endAt) {
            setAvailableFriends(appointmentFriends);
            return () => {
                ignore = true;
            };
        }

        fetchAvailableAppointmentFriends(selection.startAt, selection.endAt)
            .then((friends) => {
                if (!ignore) {
                    setAvailableFriends(friends);
                    setSelectedFriendNames((currentNames) =>
                        currentNames.filter((friendName) => friends.some((friend) => friend.name === friendName)),
                    );
                }
            })
            .catch(() => {
                if (!ignore) {
                    setAvailableFriends([]);
                    setSelectedFriendNames([]);
                }
            });

        return () => {
            ignore = true;
        };
    }, [selection.startAt, selection.endAt]);

    const toggleFriend = (friendName: string) => {
        setSelectedFriendNames((currentNames) =>
            currentNames.includes(friendName)
                ? currentNames.filter((currentName) => currentName !== friendName)
                : [...currentNames, friendName],
        );
    };

    const openCalendarPreview = (friendName: string) => {
        setCalendarPreviewNames(selectedFriendNames.length > 1 ? selectedFriendNames : [friendName]);
    };

    const handleDragStart = (event: PointerEvent<HTMLButtonElement>) => {
        dragStateRef.current = {
            startY: event.clientY,
            startHeight: sheetHeight,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleDragMove = (event: PointerEvent<HTMLButtonElement>) => {
        const dragState = dragStateRef.current;

        if (!dragState) {
            return;
        }

        const nextHeight = dragState.startHeight + dragState.startY - event.clientY;
        setSheetHeight(clamp(nextHeight, dismissSheetHeight, expandedSheetHeight));
    };

    const handleDragEnd = () => {
        if (!dragStateRef.current) {
            return;
        }

        dragStateRef.current = null;
        if (sheetHeight <= dismissSheetHeight + 32) {
            onDismiss();
            return;
        }

        setSheetHeight((currentHeight) =>
            currentHeight > (collapsedSheetHeight + expandedSheetHeight) / 2
                ? expandedSheetHeight
                : collapsedSheetHeight,
        );
    };

    return (
        <aside
            className="absolute inset-x-0 bottom-0 z-30 flex min-h-0 flex-col bg-relink-white px-5 pb-1 pt-2 font-display shadow-[0_-1px_10px_0_#cdd0ff]"
            style={{ height: sheetHeight, maxHeight: 'calc(100dvh - 96px)' }}
            aria-label="약속 친구 목록"
        >
            <SheetDragHandle
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
            />
            <AppointmentFriendSelectionHeader selectionLabel={selection.label} />
            <AppointmentFriendList
                friends={availableFriends}
                selectedFriendNames={selectedFriendNames}
                onFriendToggle={toggleFriend}
                onCalendarOpen={openCalendarPreview}
            />
            {hasSelectedFriends ? (
                <AppointmentFriendNextButton
                    selectedCount={selectedFriendNames.length}
                    onClick={() => onNext(selectedFriends)}
                />
            ) : null}

            {calendarPreviewNames ? (
                <FriendCalendarPreviewModal
                    friendNames={calendarPreviewNames}
                    blocks={calendarPreviewBlocks}
                    onClose={() => setCalendarPreviewNames(null)}
                />
            ) : null}
        </aside>
    );
}

function AppointmentFriendNextButton({
    selectedCount,
    onClick,
}: {
    selectedCount: number;
    onClick: () => void;
}) {
    return (
        <div className="flex flex-none px-1 pb-3 pt-2">
            <button
                type="button"
                className="h-11 w-full rounded-md bg-relink-lavender-intense text-md text-relink-white transition-transform active:scale-[0.98]"
                onClick={onClick}
            >
                다음
                <span className="ml-1 text-relink-white/80">{selectedCount}</span>
            </button>
        </div>
    );
}

function SheetDragHandle({
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
}: {
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
}) {
    return (
        <button
            type="button"
            className="mb-2 flex h-6 w-full touch-none items-center justify-center"
            aria-label="친구 목록 높이 조절"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
        >
            <span className="h-1 w-12 rounded-full bg-relink-lavender-middle" aria-hidden="true" />
        </button>
    );
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function toCalendarPreviewBlocks(friends: AppointmentFriend[]) {
    const calendars = friends.flatMap((friend) => (friend.calendar ? [friend.calendar] : []));
    if (calendars.length === 0) {
        return undefined;
    }

    const blockedSlots = new Map<string, FriendCalendarPreviewBlock>();
    for (const calendar of calendars) {
        const weekStart = parseDate(calendar.weekStartDate);
        calendar.days.forEach((day) => {
            const dayIndex = Math.round((parseDate(day.date).getTime() - weekStart.getTime()) / 86_400_000);
            day.slots.forEach((slot) => {
                const start = parseTimeValue(slot.startTime);
                const end = parseTimeValue(slot.endTime);
                if (dayIndex < 0 || dayIndex > 6 || start < 8 || start >= 24) {
                    return;
                }

                const status = toPreviewSlotStatus(slot.status);
                blockedSlots.set(`${dayIndex}-${start}-${end}-${status}`, {
                    dayIndex,
                    start,
                    end,
                    status,
                });
            });
        });
    }

    return mergePreviewBlocks([...blockedSlots.values()]);
}

function mergePreviewBlocks(blocks: FriendCalendarPreviewBlock[]) {
    return blocks
        .sort((first, second) => first.dayIndex - second.dayIndex || first.start - second.start)
        .reduce<FriendCalendarPreviewBlock[]>((merged, block) => {
            const previous = merged[merged.length - 1];
            if (previous && previous.dayIndex === block.dayIndex && previous.status === block.status && previous.end === block.start) {
                previous.end = block.end;
                return merged;
            }

            return [...merged, { ...block }];
        }, []);
}

function toPreviewSlotStatus(status: string): PreviewSlotStatus {
    switch (status) {
        case 'APPOINTMENT':
            return 'scheduled';
        case 'UNAVAILABLE':
            return 'unavailable';
        case 'NEGOTIABLE':
            return 'adjustable';
        case 'AVAILABLE':
        default:
            return 'available';
    }
}

function parseDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function parseTimeValue(time: string) {
    const [hour = '0', minute = '0'] = time.split(':');

    return Number(hour) + Number(minute) / 60;
}
