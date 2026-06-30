export type NotificationItem = {
    id: string;
    notificationId: string;
    title: string;
    body: string;
    linkUrl: string | null;
    read: boolean;
    createdAt: string;
    readAt: string | null;
    aggregateCount?: number;
    mergedIds?: string[];
};
