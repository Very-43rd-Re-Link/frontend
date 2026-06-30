import apiClient from '@/lib/api-client';

import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type ApiSlotStatus = 'UNAVAILABLE' | 'NEGOTIABLE' | 'AVAILABLE' | 'APPOINTMENT';

export type AppointmentCalendar = {
    weekStartDate: string;
    weekEndDate: string;
    days: {
        date: string;
        slots: {
            startTime: string;
            endTime: string;
            status: ApiSlotStatus;
            appointmentId: number | null;
        }[];
    }[];
};

type AvailableFriendListResponse = {
    startAt: string;
    endAt: string;
    friends: {
        memberId: number;
        name: string;
        imageUrl: string | null;
        calendar: AppointmentCalendar;
    }[];
};

type AppointmentResponse = {
    appointmentId: number;
    title: string;
    startAt: string;
    endAt: string;
    memo: string | null;
    participants: {
        memberId: number;
        name: string;
        imageUrl: string | null;
    }[];
};

type CreateAppointmentRequest = {
    title: string;
    startAt: string;
    endAt: string;
    memo?: string;
    participantMemberIds: number[];
};

export async function fetchAvailableAppointmentFriends(startAt: string, endAt: string) {
    const response = await apiClient.get<AvailableFriendListResponse>('/appointments/available-friends', {
        params: { startAt, endAt },
    });

    return response.friends.map<AppointmentFriend>((friend) => ({
        memberId: friend.memberId,
        name: friend.name,
        imageUrl: friend.imageUrl,
        calendar: friend.calendar,
        availability: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'empty'],
    }));
}

export async function createAppointment(request: CreateAppointmentRequest) {
    return apiClient.post<AppointmentResponse, CreateAppointmentRequest>('/appointments', request);
}
