import type { AppointmentCalendar } from '@/api/appointments';

export type AvailabilitySegmentStatus = 'available' | 'adjustable' | 'unavailable' | 'lightning' | 'empty';

export type AppointmentFriend = {
    memberId?: number;
    name: string;
    imageUrl?: string | null;
    calendar?: AppointmentCalendar;
    availability: AvailabilitySegmentStatus[];
    isActive?: boolean;
    availableSlotCount?: number;
    availabilityFromLabel?: string;
    availabilityToLabel?: string;
};
