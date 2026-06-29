import type { FriendListItem, FriendOverview } from '@/features/friends/types';

export const recommendedFriends: FriendOverview[] = [
    {
        name: '김가영',
        slots: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    { name: '김다영', slots: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan'] },
    {
        name: '김마영',
        slots: ['cyan', 'cyan', 'cyan', 'yellow', 'yellow'],
        isActive: true,
        activeColor: '#fee73d',
    },
    {
        name: '김사영',
        slots: ['green', 'green', 'green', 'green'],
    },
    {
        name: '김자영',
        slots: ['yellow', 'yellow', 'green'],
    },
    {
        name: '김하영',
        slots: [],
    },
] as const;

export const friendList: FriendListItem[] = [
    {
        name: '김가영',
        status: '번개 가능 ~ 3시간 30분 뒤',
        slots: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    {
        name: '김다영',
        status: '번개 가능 ~ 3시간 30분 뒤',
        slots: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    {
        name: '김마영',
        status: '번개 가능 ~ 2시간 30분 뒤',
        slots: ['yellow', 'yellow', 'cyan', 'cyan', 'cyan'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    {
        name: '김사영',
        status: '지금 가능 ~ 3시간 30분 뒤',
        slots: ['green', 'green', 'green', 'green'],
    },
    {
        name: '김자영',
        status: '지금 가능 ~ 2시간 30분 뒤',
        slots: ['yellow', 'yellow', 'green', 'green'],
    },
    {
        name: '김하영',
        status: '번개 가능 ~ 1시간 30분 뒤',
        slots: ['cyan', 'cyan', 'yellow', 'yellow'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    {
        name: '박서연',
        status: '지금 가능 ~ 1시간 뒤',
        slots: ['green', 'green', 'cyan'],
    },
    {
        name: '이도윤',
        status: '번개 가능 ~ 4시간 뒤',
        slots: ['cyan', 'cyan', 'cyan', 'cyan', 'green'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    {
        name: '최민준',
        status: '지금 가능 ~ 30분 뒤',
        slots: ['green', 'yellow'],
    },
    {
        name: '정수빈',
        status: '번개 가능 ~ 5시간 뒤',
        slots: ['yellow', 'yellow', 'cyan', 'cyan', 'cyan', 'cyan'],
        isActive: true,
        activeColor: '#fee73d',
    },
    {
        name: '한지우',
        status: '지금 가능 ~ 2시간 뒤',
        slots: ['green', 'green', 'green', 'yellow'],
    },
    {
        name: '오유진',
        status: '번개 가능 ~ 6시간 뒤',
        slots: ['cyan', 'cyan', 'cyan'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    {
        name: '강나은',
        status: '지금 가능 ~ 4시간 30분 뒤',
        slots: ['green', 'green', 'green', 'green', 'cyan'],
    },
];
