import { useState } from 'react';

import notificationSvg from '@/assets/icons/notification.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { NotificationToggle } from '@/features/mypage/components/notification-toggle';
import type { MyPageProfile } from '@/features/mypage/types';

type SettingsCardProps = {
    profile: MyPageProfile;
    onLogout: () => void;
    onWithdraw: () => void;
    isActionPending?: boolean;
};

export function SettingsCard({
    profile,
    onLogout,
    onWithdraw,
    isActionPending = false,
}: SettingsCardProps) {
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="mx-5 mt-4 rounded-lg bg-relink-white px-8 py-8 shadow-relink-card">
            <div className="flex flex-col gap-4 font-display text-[18px] leading-7 text-relink-gray-400">
                <p>
                    가입경로: <span>{profile.signupProvider}</span>
                </p>
            </div>

            <div className="my-7 h-px bg-relink-gray-200" />

            <div>
                <p className="mb-3 font-display text-[18px] leading-7 text-relink-gray-400">알림 설정</p>
                <div className="flex items-center gap-4">
                    <InlineSvgIcon svg={notificationSvg} className="h-8 w-8 text-relink-lavender-intense" />
                    <NotificationToggle
                        checked={isNotificationEnabled}
                        onChange={() => setIsNotificationEnabled((current) => !current)}
                    />
                </div>
            </div>

            <div className="my-7 h-px bg-relink-gray-200" />

            <div>
                <p className="mb-4 font-display text-[18px] leading-7 text-relink-gray-400">기타 설정</p>
                <button
                    type="button"
                    aria-expanded={isExpanded}
                    className="w-full rounded-lg bg-relink-lavender-soft py-4 font-display text-[18px] leading-6 text-relink-gray-400"
                    onClick={() => setIsExpanded((current) => !current)}
                >
                    {isExpanded ? '닫기' : '펼치기'}
                </button>

                {isExpanded ? (
                    <div className="mt-6 flex flex-col gap-4 border-t border-relink-gray-200 pt-6">
                        <button
                            type="button"
                            disabled={isActionPending}
                            onClick={onLogout}
                            className="text-left font-display text-[18px] leading-7 text-relink-gray-400 disabled:opacity-60"
                        >
                            {isActionPending ? '처리 중...' : '로그아웃'}
                        </button>
                        <button
                            type="button"
                            disabled={isActionPending}
                            onClick={onWithdraw}
                            className="text-left font-display text-[18px] leading-7 text-relink-rose disabled:opacity-60"
                        >
                            회원탈퇴
                        </button>
                        <p className="rounded-lg bg-relink-lavender-soft px-4 py-4 text-center font-display text-md text-relink-rose">
                            30일간 계정이 비활성화되며, 영구 삭제 전 다시 로그인하면 계정을 복구할 수 있습니다.
                        </p>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
