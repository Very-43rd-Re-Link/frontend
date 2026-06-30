import { useEffect, useState } from 'react';

import type { UpdateMyProfileRequest } from '@/api/mypage';
import { FriendSummaryCard } from '@/features/mypage/components/friend-summary-card';
import { MyPageHeader } from '@/features/mypage/components/my-page-header';
import { MyPageProfileSection } from '@/features/mypage/components/my-page-profile-section';
import { SettingsCard } from '@/features/mypage/components/settings-card';
import { SettingsSectionTitle } from '@/features/mypage/components/settings-section-title';
import type { MyPageProfile } from '@/features/mypage/types';

type MyPageScreenProps = {
    profile: MyPageProfile;
    onUpdateProfile: (request: UpdateMyProfileRequest, imageFile?: File | null) => Promise<void>;
    onLogout: () => void;
    onWithdraw: () => void;
    isActionPending?: boolean;
    isProfileUpdatePending?: boolean;
};

export function MyPageScreen({
    profile,
    onUpdateProfile,
    onLogout,
    onWithdraw,
    isActionPending = false,
    isProfileUpdatePending = false,
}: MyPageScreenProps) {
    const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);

    return (
        <div className="relative flex h-full min-h-0 flex-col bg-relink-white">
            <MyPageHeader />

            <main className="relink-hidden-scrollbar min-h-0 flex-1 overflow-y-auto pb-24">
                <MyPageProfileSection profile={profile} onEdit={() => setIsProfileEditorOpen(true)} />
                <FriendSummaryCard friendCount={profile.friendCount} />
                <SettingsSectionTitle />
                <SettingsCard
                    profile={profile}
                    onLogout={onLogout}
                    onWithdraw={onWithdraw}
                    isActionPending={isActionPending}
                />
            </main>

            {isProfileEditorOpen ? (
                <ProfileEditDialog
                    profile={profile}
                    isSubmitting={isProfileUpdatePending}
                    onClose={() => setIsProfileEditorOpen(false)}
                    onSubmit={async (request, imageFile) => {
                        await onUpdateProfile(request, imageFile);
                        setIsProfileEditorOpen(false);
                    }}
                />
            ) : null}
        </div>
    );
}

type ProfileEditDialogProps = {
    profile: MyPageProfile;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (request: UpdateMyProfileRequest, imageFile?: File | null) => Promise<void>;
};

function ProfileEditDialog({
    profile,
    isSubmitting,
    onClose,
    onSubmit,
}: ProfileEditDialogProps) {
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio === '바이오' ? '' : profile.bio);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(profile.imageUrl);

    useEffect(() => {
        if (!imageFile) {
            setImagePreviewUrl(profile.imageUrl);
            return undefined;
        }

        const objectUrl = URL.createObjectURL(imageFile);
        setImagePreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile, profile.imageUrl]);

    return (
        <>
            <button
                type="button"
                aria-label="프로필 편집 닫기"
                className="absolute inset-0 z-[60] bg-black/10"
                onClick={onClose}
            />
            <section className="absolute left-5 right-5 top-24 z-[70] rounded-lg bg-relink-white px-6 py-6 font-display shadow-relink-card">
                <div className="flex items-center justify-between">
                    <h2 className="text-[20px] leading-7 text-relink-gray-700">프로필 편집</h2>
                    <button type="button" className="text-md text-relink-gray-400" onClick={onClose}>
                        닫기
                    </button>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                    <label className="flex flex-col gap-3 text-md text-relink-gray-500">
                        프로필 이미지
                        <div className="flex items-center gap-4">
                            {imagePreviewUrl ? (
                                <img
                                    src={imagePreviewUrl}
                                    alt="프로필 이미지 미리보기"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-relink-lavender-soft text-sm text-relink-gray-400">
                                    없음
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                                className="min-w-0 flex-1 text-sm text-relink-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-relink-lavender-soft file:px-3 file:py-2 file:font-display file:text-sm file:text-relink-ink"
                            />
                        </div>
                    </label>
                    <label className="flex flex-col gap-2 text-md text-relink-gray-500">
                        닉네임
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="h-11 rounded-lg bg-relink-lavender-soft px-3 text-md text-relink-ink outline-none"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-md text-relink-gray-500">
                        상태 메시지
                        <input
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="상태 메시지를 입력해 주세요"
                            className="h-11 rounded-lg bg-relink-lavender-soft px-3 text-md text-relink-ink outline-none"
                        />
                    </label>
                </div>

                <button
                    type="button"
                    disabled={isSubmitting || !name.trim()}
                    className="mt-6 h-12 w-full rounded-lg bg-relink-lavender-intense font-display text-md text-relink-white disabled:opacity-60"
                    onClick={() => onSubmit({
                        name: name.trim(),
                        bio: bio.trim(),
                        imageUrl: profile.imageUrl,
                    }, imageFile)}
                >
                    {isSubmitting ? '저장 중...' : '저장'}
                </button>
            </section>
        </>
    );
}
