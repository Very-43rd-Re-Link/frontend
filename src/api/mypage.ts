import axios from 'axios';

import type { MyPageProfile } from '@/features/mypage/types';
import apiClient, { api } from '@/lib/api-client';

type MyPageResponse = {
    memberId: number;
    name: string | null;
    bio: string | null;
    friendCount: number;
    signupProvider: string | null;
    accountId: string | null;
    email: string | null;
    imageUrl: string | null;
    active: boolean;
};

export type UpdateMyProfileRequest = {
    name: string;
    bio: string;
    imageUrl: string | null;
};

type ProfileImageUploadResponse = {
    uploadUrl: string;
    storageKey: string;
    imageUrl: string;
    expiresIn: number;
};

export async function fetchMyPageProfile(): Promise<MyPageProfile> {
    const response = await apiClient.get<MyPageResponse>('/members/me');

    return toMyPageProfile(response);
}

export async function updateMyProfile(request: UpdateMyProfileRequest): Promise<MyPageProfile> {
    const response = await apiClient.patch<MyPageResponse, UpdateMyProfileRequest>('/members/me/profile', request);

    return toMyPageProfile(response);
}

export async function uploadProfileImage(file: File) {
    const upload = await issueProfileImageUploadUrl(file);

    const config = {
        headers: { 'Content-Type': file.type },
    };

    if (upload.uploadUrl.startsWith('/')) {
        await api.put(upload.uploadUrl, file, config);
    } else {
        await axios.put(upload.uploadUrl, file, config);
    }

    return upload.imageUrl;
}

export async function withdrawMyAccount() {
    await apiClient.delete<void>('/members/me');
}

async function issueProfileImageUploadUrl(file: File) {
    return apiClient.post<ProfileImageUploadResponse, {
        fileName: string;
        contentType: string;
        fileSize: number;
    }>('/members/me/profile-image/presigned-url', {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
    });
}

function toMyPageProfile(response: MyPageResponse): MyPageProfile {
    return {
        memberId: response.memberId,
        name: response.name || '회원',
        bio: response.bio || '바이오',
        friendCount: response.friendCount,
        signupProvider: toProviderLabel(response.signupProvider),
        accountId: response.accountId || String(response.memberId),
        email: response.email || '',
        imageUrl: response.imageUrl,
        slots: [],
        isActive: response.active,
        activeColor: '#66f2f6',
    };
}

function toProviderLabel(provider: string | null) {
    switch (provider) {
        case 'GOOGLE':
            return 'Google';
        case 'KAKAO':
            return 'Kakao';
        default:
            return provider || '-';
    }
}
