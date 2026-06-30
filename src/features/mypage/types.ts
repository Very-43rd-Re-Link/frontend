import type { RingSlots } from '@/components/common/friend-status/ring-colors';

export type MyPageProfile = {
    memberId: number;
    name: string;
    bio: string;
    friendCount: number;
    signupProvider: string;
    accountId: string;
    email: string;
    imageUrl: string | null;
    slots: RingSlots;
    isActive: boolean;
    activeColor: string;
};
