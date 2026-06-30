export type SlotStatus = 'available' | 'adjustable' | 'unavailable' | 'scheduled';

export type EditableSlotStatus = Exclude<SlotStatus, 'scheduled'>;

export type ScheduledBlock = {
    dayIndex: number;
    startHour: number;
    endHour: number;
    title: string;
    location: string;
    memo?: string;
};

export type AppointmentSelection = {
    slotKeys: string[];
    label: string;
    startAt?: string;
    endAt?: string;
};
