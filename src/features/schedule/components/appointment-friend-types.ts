export type AvailabilitySegmentStatus = 'available' | 'adjustable' | 'unavailable' | 'lightning' | 'empty';

export type AppointmentFriend = {
    name: string;
    availability: AvailabilitySegmentStatus[];
};
