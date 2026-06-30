import type { RefObject } from 'react';

import notificationSvg from '@/assets/icons/notification.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { NotificationItem } from '@/features/notifications/types';

type NotificationInboxScreenProps = {
    notifications: NotificationItem[];
    isLoading?: boolean;
    isMarkingRead?: boolean;
    errorMessage?: string;
    loadMoreRef: RefObject<HTMLDivElement | null>;
    onBack: () => void;
    onMarkAllRead: () => void;
    onOpen: (notification: NotificationItem) => void;
    onDelete: (notification: NotificationItem) => void;
};

export function NotificationInboxScreen({
    notifications,
    isLoading = false,
    isMarkingRead = false,
    errorMessage = '',
    loadMoreRef,
    onBack,
    onMarkAllRead,
    onOpen,
    onDelete,
}: NotificationInboxScreenProps) {
    return (
        <div className="flex h-full min-h-0 flex-col bg-relink-white">
            <header className="shrink-0 border-b border-relink-card bg-relink-white px-6 pb-5 pt-10 shadow-[0_1px_8px_rgba(205,208,255,0.32)]">
                <div className="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        className="font-display text-lg text-relink-gray-400"
                        onClick={onBack}
                    >
                        뒤로
                    </button>
                    <div className="flex items-center gap-2">
                        <InlineSvgIcon svg={notificationSvg} className="h-6 w-6 text-relink-ink" />
                        <h1 className="font-display text-[24px] leading-8 text-relink-ink">알림함</h1>
                    </div>
                    <button
                        type="button"
                        disabled={isMarkingRead || notifications.length === 0}
                        className="font-display text-lg text-relink-lavender-intense disabled:text-relink-gray-300"
                        onClick={onMarkAllRead}
                    >
                        모두 읽음
                    </button>
                </div>
            </header>

            <main className="relink-hidden-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-24 pt-4">
                {errorMessage ? (
                    <p className="py-10 text-center font-display text-sm text-relink-gray-400">{errorMessage}</p>
                ) : notifications.length === 0 && !isLoading ? (
                    <div className="flex min-h-full items-center justify-center text-center">
                        <p className="font-display text-lg text-relink-gray-400">도착한 알림이 없습니다.</p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {notifications.map((notification) => (
                            <NotificationRow
                                key={notification.id}
                                notification={notification}
                                onOpen={() => onOpen(notification)}
                                onDelete={() => onDelete(notification)}
                            />
                        ))}
                    </ul>
                )}

                <div ref={loadMoreRef} className="h-8" />

                {isLoading ? (
                    <p className="py-3 text-center font-display text-sm text-relink-gray-300">Loading...</p>
                ) : null}
            </main>
        </div>
    );
}

type NotificationRowProps = {
    notification: NotificationItem;
    onOpen: () => void;
    onDelete: () => void;
};

function NotificationRow({ notification, onOpen, onDelete }: NotificationRowProps) {
    const aggregateCount = notification.aggregateCount ?? 1;

    return (
        <li className="rounded-lg border border-relink-card bg-relink-white px-4 py-4 shadow-[0_4px_14px_rgba(205,208,255,0.2)]">
            <div className="flex items-start gap-3">
                <span
                    aria-hidden
                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                        notification.read ? 'bg-relink-gray-300' : 'bg-relink-lavender-intense'
                    }`}
                />
                <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={onOpen}
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <strong className="min-w-0 flex-1 truncate font-display text-md text-relink-ink">
                            {notification.title}
                        </strong>
                        {aggregateCount > 1 ? (
                            <span className="shrink-0 rounded-full bg-relink-lavender-soft px-2 py-0.5 font-display text-md leading-5 text-relink-lavender-intense">
                                {aggregateCount}개
                            </span>
                        ) : null}
                    </div>
                    <span className="mt-1 line-clamp-2 block font-display text-sm leading-5 text-relink-gray-500">
                        {notification.body}
                    </span>
                    <span className="mt-3 block font-display text-xs text-relink-gray-300">
                        {formatDateTime(notification.createdAt)}
                    </span>
                </button>
                <button
                    type="button"
                    className="shrink-0 rounded-lg px-2 py-1 font-display text-xs text-relink-gray-400"
                    onClick={onDelete}
                >
                    삭제
                </button>
            </div>
        </li>
    );
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}
