import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { logout } from '@/api/auth';
import {
    type UpdateMyProfileRequest,
    fetchMyPageProfile,
    updateMyProfile,
    uploadProfileImage,
    withdrawMyAccount,
} from '@/api/mypage';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { applyFriendStatuses, useFriendStatuses } from '@/components/common/friend-status';
import { routePaths } from '@/constants/route-paths';
import { MyPageScreen } from '@/features/mypage/components/my-page-screen';
import type { MyPageProfile } from '@/features/mypage/types';
import { clearAuthTokens } from '@/lib/auth-token-storage';

export function MyPageView() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<MyPageProfile | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isActionPending, setIsActionPending] = useState(false);
    const [isProfileUpdatePending, setIsProfileUpdatePending] = useState(false);
    const { statusMap, loadNextStatuses } = useFriendStatuses();

    useEffect(() => {
        let isMounted = true;

        fetchMyPageProfile()
            .then((nextProfile) => {
                if (isMounted) {
                    setProfile(nextProfile);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setErrorMessage('마이페이지 정보를 불러오지 못했습니다.');
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!profile) {
            return;
        }

        void loadNextStatuses([profile.memberId]);
    }, [loadNextStatuses, profile]);

    async function handleLogout() {
        setIsActionPending(true);

        try {
            await logout();
        } finally {
            clearAuthTokens();
            navigate(routePaths.login, { replace: true });
        }
    }

    async function handleUpdateProfile(request: UpdateMyProfileRequest, imageFile?: File | null) {
        setIsProfileUpdatePending(true);

        try {
            const imageUrl = imageFile ? await uploadProfileImage(imageFile) : request.imageUrl;
            const nextProfile = await updateMyProfile({
                ...request,
                imageUrl,
            });
            setProfile(nextProfile);
        } finally {
            setIsProfileUpdatePending(false);
        }
    }

    async function handleWithdraw() {
        if (!window.confirm('회원탈퇴를 진행할까요?')) {
            return;
        }

        setIsActionPending(true);

        try {
            await withdrawMyAccount();
        } finally {
            clearAuthTokens();
            navigate(routePaths.login, { replace: true });
        }
    }

    if (errorMessage) {
        return (
            <div className="flex h-full items-center justify-center px-8 text-center font-display text-md text-relink-gray-500">
                {errorMessage}
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingSpinner label="마이페이지 정보를 불러오는 중" />
            </div>
        );
    }

    const profileWithStatus = applyFriendStatuses([profile], statusMap)[0];

    return (
        <MyPageScreen
            profile={profileWithStatus}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onWithdraw={handleWithdraw}
            isActionPending={isActionPending}
            isProfileUpdatePending={isProfileUpdatePending}
        />
    );
}
