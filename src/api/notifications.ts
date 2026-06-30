import type { NotificationItem } from '@/features/notifications/types';
import apiClient from '@/lib/api-client';

type NotificationResponse = {
    id: number;
    notificationId: number;
    title: string;
    body: string;
    linkUrl: string | null;
    read: boolean;
    createdAt: string;
    readAt: string | null;
};

type NotificationInboxResponse = {
    notifications: NotificationResponse[];
    page: number;
    size: number;
    hasNext: boolean;
    hasUnread: boolean;
};

export type NotificationPage = {
    notifications: NotificationItem[];
    page: number;
    hasNext: boolean;
    hasUnread: boolean;
};

export async function fetchNotifications(page = 0, size = 20): Promise<NotificationPage> {
    const response = await apiClient.get<NotificationInboxResponse>('/notifications', {
        params: { page, size },
    });

    return {
        notifications: response.notifications.map(toNotificationItem),
        page: response.page,
        hasNext: response.hasNext,
        hasUnread: response.hasUnread,
    };
}

export async function markAllNotificationsRead() {
    await apiClient.patch<void, undefined>('/notifications/read-all');
}

export async function deleteNotification(notificationId: string) {
    await apiClient.delete<void>(`/notifications/${notificationId}`);
}

function toNotificationItem(notification: NotificationResponse): NotificationItem {
    return {
        id: String(notification.id),
        notificationId: String(notification.notificationId),
        title: notification.title,
        body: notification.body,
        linkUrl: notification.linkUrl,
        read: notification.read,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
    };
}
