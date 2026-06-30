import type { NotificationItem } from '@/features/notifications/types';

const now = new Date('2026-06-30T18:30:00+09:00').getTime();

const samples: Array<[string, string, string | null]> = [
    ['새 채팅 메시지', '서연: 이번 주말 일정 괜찮아?', '/chat/rooms/12'],
    ['새 채팅 메시지', '서연: 토요일 저녁도 괜찮고 일요일 점심도 좋아.', '/chat/rooms/12'],
    ['새 채팅 메시지', '서연: 장소는 성수 쪽으로 볼까?', '/chat/rooms/12'],
    ['새 채팅 메시지', '민지: 사진 확인했어. 여기 괜찮다!', '/chat/rooms/18'],
    ['새 채팅 메시지', '민지: 예약 가능 시간도 같이 봐줘.', '/chat/rooms/18'],
    ['새로운 약속 요청', '민지가 금요일 저녁 약속 시간을 제안했어요.', '/chat/appointments'],
    ['번개 모임 오픈', '근처 친구들이 지금 만날 수 있어요.', '/'],
    ['친구 요청', '지훈님이 친구 요청을 보냈어요.', '/friends'],
    ['일정 겹침 발견', '3명의 친구와 겹치는 시간이 발견됐어요.', '/calendar'],
    ['프로필 업데이트 완료', '프로필 이미지가 정상적으로 변경됐어요.', '/mypage'],
    ['약속 시간 임박', '오늘 오후 7시 약속까지 1시간 남았어요.', '/calendar'],
];

export const mockNotifications: NotificationItem[] = Array.from({ length: 34 }, (_, index) => {
    const [title, body, linkUrl] = samples[index % samples.length];
    const createdAt = new Date(now - index * 27 * 60 * 1000).toISOString();
    const read = index > 6;

    return {
        id: String(index + 1),
        notificationId: String(1000 + index),
        title,
        body,
        linkUrl,
        read,
        createdAt,
        readAt: read ? createdAt : null,
    };
});
