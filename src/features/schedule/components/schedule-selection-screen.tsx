import type { PointerEvent } from 'react';

import { FloatingAddButton } from '@/components/common/floating-add-button';
import { AppointmentFriendSelection } from '@/features/schedule/components/appointment-friend-selection';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';
import { ScheduleDetailModal } from '@/features/schedule/components/schedule-detail-modal';
import { ScheduleGrid } from '@/features/schedule/components/schedule-grid';
import { ScheduleHeader } from '@/features/schedule/components/schedule-header';
import { StatusChangeMenu } from '@/features/schedule/components/status-change-menu';
import { WeekNavigator } from '@/features/schedule/components/week-navigator';
import type { AppointmentSelection, EditableSlotStatus, ScheduledBlock } from '@/features/schedule/types';

type StatusChangeMenuState = {
    currentStatus: EditableSlotStatus;
    slotKeys: string[];
    position: {
        x: number;
        y: number;
    };
};

type ScheduleSelectionScreenProps = {
    title: string;
    weekTitle: string;
    weekDates: Date[];
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
    selectedSlotKeys: Set<string>;
    showFloatingAction: boolean;
    statusChangeMenu: StatusChangeMenuState | null;
    selectedSchedule: ScheduledBlock | null;
    appointmentSelection: AppointmentSelection | null;
    onPointerCancel: () => void;
    onPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onSlotClick: (dayIndex: number, hour: number) => void;
    onSlotPointerDown: (dayIndex: number, hour: number, event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onScheduledBlockClick: (schedule: ScheduledBlock) => void;
    onStatusSelect: (status: EditableSlotStatus) => void;
    onStatusMenuClose: () => void;
    onScheduleModalClose: () => void;
    onAppointmentSelectionDismiss: () => void;
    onAppointmentSelectionNext: (selectedFriends: AppointmentFriend[]) => void;
};

export function ScheduleSelectionScreen({
    title,
    weekTitle,
    weekDates,
    slotStatuses,
    scheduledSlotMap,
    selectedSlotKeys,
    showFloatingAction,
    statusChangeMenu,
    selectedSchedule,
    appointmentSelection,
    onPointerCancel,
    onPointerUp,
    onPreviousWeek,
    onNextWeek,
    onSlotClick,
    onSlotPointerDown,
    onSlotPointerMove,
    onSlotPointerUp,
    onScheduledBlockClick,
    onStatusSelect,
    onStatusMenuClose,
    onScheduleModalClose,
    onAppointmentSelectionDismiss,
    onAppointmentSelectionNext,
}: ScheduleSelectionScreenProps) {
    return (
        <div
            className="relative flex h-full min-h-0 flex-col gap-5 bg-relink-white px-5 pt-10 font-display"
            onPointerCancel={onPointerCancel}
            onPointerUp={onPointerUp}
        >
            <ScheduleHeader title={title} />

            <main className="relink-hidden-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 pb-2">
                <WeekNavigator title={weekTitle} onPreviousWeek={onPreviousWeek} onNextWeek={onNextWeek} />
                <ScheduleGrid
                    weekDates={weekDates}
                    slotStatuses={slotStatuses}
                    scheduledSlotMap={scheduledSlotMap}
                    selectedSlotKeys={selectedSlotKeys}
                    onSlotClick={onSlotClick}
                    onSlotPointerDown={onSlotPointerDown}
                    onSlotPointerMove={onSlotPointerMove}
                    onSlotPointerUp={onSlotPointerUp}
                    onScheduledBlockClick={onScheduledBlockClick}
                />
                {showFloatingAction ? <FloatingAddButton placement="inline" /> : null}
            </main>

            {statusChangeMenu ? (
                <StatusChangeMenu
                    currentStatus={statusChangeMenu.currentStatus}
                    position={statusChangeMenu.position}
                    onSelect={onStatusSelect}
                    onClose={onStatusMenuClose}
                />
            ) : null}

            {selectedSchedule ? <ScheduleDetailModal schedule={selectedSchedule} onClose={onScheduleModalClose} /> : null}

            {appointmentSelection ? (
                <AppointmentFriendSelection
                    selection={appointmentSelection}
                    onDismiss={onAppointmentSelectionDismiss}
                    onNext={onAppointmentSelectionNext}
                />
            ) : null}
        </div>
    );
}

export type { StatusChangeMenuState };
