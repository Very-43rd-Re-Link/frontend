import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAppointment } from '@/api/appointments';
import { GenericAvatar } from '@/components/common/nav/generic-avatar';
import { routePaths } from '@/constants/route-paths';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';
import type { AppointmentSelection } from '@/features/schedule/types';

type AppointmentProposalReviewProps = {
    selection: AppointmentSelection;
    selectedFriends: AppointmentFriend[];
    onBack: () => void;
};

const activityOptions = ['카페', '밥약', '공부', '운동', '놀이', '음악'];

export function AppointmentProposalReview({
    selection,
    selectedFriends,
    onBack,
}: AppointmentProposalReviewProps) {
    const navigate = useNavigate();
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
    const [customActivity, setCustomActivity] = useState('');
    const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(null);
    const [inviteSheetLink, setInviteSheetLink] = useState<string | null>(null);
    const [createdChatRoomId, setCreatedChatRoomId] = useState<string | null>(null);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isRequiredSelectionComplete = Boolean(selectedActivity || customActivity.trim());

    const openInviteLinkDialog = () => {
        if (createdInviteLink) {
            setInviteSheetLink(createdInviteLink);
        }
    };

    const handleBottomButtonClick = async () => {
        if (!isRequiredSelectionComplete) {
            onBack();
            return;
        }

        const participantMemberIds = selectedFriends
            .map((friend) => friend.memberId)
            .filter((memberId): memberId is number => typeof memberId === 'number');

        if (!selection.startAt || !selection.endAt || participantMemberIds.length === 0) {
            setIsCompleteDialogOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const appointment = await createAppointment({
                title: selectedActivity ?? customActivity.trim(),
                startAt: selection.startAt,
                endAt: selection.endAt,
                memo: '',
                participantMemberIds,
            });
            setCreatedChatRoomId(appointment.chatRoomId ? String(appointment.chatRoomId) : null);
            setCreatedInviteLink(toAbsoluteInviteLink(appointment.inviteLink));
            setIsCompleteDialogOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="relink-hidden-scrollbar flex h-full min-h-0 flex-col overflow-y-auto bg-relink-white px-5 pb-6 pt-6 font-display">
            <h1 className="text-[27px] leading-9 text-relink-gray-700">최종 제안을 확인해주세요.</h1>

            <section className="mt-5 flex items-center gap-4 text-relink-gray-400">
                <p className="text-lg">{selection.label.replace('일 ', '').replace(' ~ ', '~')}</p>
                <button type="button" className="rounded bg-relink-lavender-soft px-4 py-1 text-sm text-relink-gray-700">
                    변경
                </button>
            </section>

            <SelectedFriendSummary selectedFriends={selectedFriends} onInviteExternalFriend={openInviteLinkDialog} />
            <AppointmentActivitySection
                selectedActivity={selectedActivity}
                customActivity={customActivity}
                onActivitySelect={(activity) => {
                    setSelectedActivity(activity);
                    setCustomActivity('');
                }}
                onCustomActivityChange={(value) => {
                    setCustomActivity(value);
                    setSelectedActivity(null);
                }}
            />
            <AppointmentMessageSection />

            <button
                type="button"
                className={`mx-auto mt-8 h-[58px] w-[240px] rounded-md text-lg transition-colors ${
                    isRequiredSelectionComplete
                        ? 'bg-relink-lavender-intense text-relink-white'
                        : 'bg-relink-lavender-soft text-relink-gray-700'
                }`}
                disabled={isSubmitting}
                onClick={handleBottomButtonClick}
            >
                {isSubmitting ? '저장하는 중' : isRequiredSelectionComplete ? '확인' : '되돌아가기'}
            </button>

            {inviteSheetLink ? (
                <ExternalFriendInviteSheet inviteLink={inviteSheetLink} onClose={() => setInviteSheetLink(null)} />
            ) : null}

            {isCompleteDialogOpen ? (
                <AppointmentProposalCompleteDialog
                    inviteLink={createdInviteLink}
                    onInviteExternalFriend={() => createdInviteLink && setInviteSheetLink(createdInviteLink)}
                    onMoveToChat={() => {
                        if (createdChatRoomId) {
                            navigate(routePaths.chatRoom(createdChatRoomId), {
                                state: {
                                    fallbackRoomKind: 'appointment',
                                    fallbackRoomName: selectedActivity ?? customActivity.trim(),
                                },
                            });
                            return;
                        }

                        navigate(routePaths.chatAppointments);
                    }}
                />
            ) : null}
        </main>
    );
}

function SelectedFriendSummary({
    selectedFriends,
    onInviteExternalFriend,
}: {
    selectedFriends: AppointmentFriend[];
    onInviteExternalFriend: () => void;
}) {
    return (
        <section className="mt-5 rounded bg-relink-white px-5 pb-4 pt-3 shadow-relink-card">
            <div className="flex items-center justify-between">
                <h2 className="text-md text-relink-gray-700">선택한 친구 리스트</h2>
                <button type="button" className="rounded bg-relink-lavender-soft px-4 py-1 text-sm text-relink-gray-700">
                    변경
                </button>
            </div>

            <div className="mt-3 flex gap-5 overflow-hidden">
                <InviteExternalFriendButton onClick={onInviteExternalFriend} />
                {selectedFriends.map((friend) => (
                    <SelectedFriendAvatar key={friend.name} friend={friend} />
                ))}
            </div>

            <div className="mt-3 h-1 w-[112px] rounded-full bg-relink-lavender-intense" />
        </section>
    );
}

function InviteExternalFriendButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            className="flex w-[58px] shrink-0 flex-col items-center text-center text-sm text-relink-gray-700"
            onClick={onClick}
        >
            <span className="relative h-[48px] w-[48px] rounded-full bg-relink-lavender-soft" aria-hidden="true">
                <span className="absolute left-1/2 top-1/2 h-1 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-relink-lavender-intense" />
                <span className="absolute left-1/2 top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-relink-lavender-intense" />
            </span>
            <span className="mt-1.5 leading-4">앱 미사용</span>
            <span className="leading-4">친구 추가</span>
        </button>
    );
}

function ExternalFriendInviteSheet({ inviteLink, onClose }: { inviteLink: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/55" role="presentation" onClick={onClose}>
            <section
                className="w-full rounded-t-md bg-relink-white px-10 pb-14 pt-10 text-center font-display shadow-[0_-1px_10px_0_#cdd0ff]"
                role="dialog"
                aria-modal="true"
                aria-label="앱 미사용 친구 추가"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="text-2xl text-relink-gray-700">앱 미사용 친구 추가</h2>
                <button
                    type="button"
                    className="mt-12 break-all text-xl text-[#2454ff]"
                    onClick={() => {
                        void navigator.clipboard?.writeText(inviteLink);
                    }}
                >
                    {inviteLink}
                </button>
            </section>
        </div>
    );
}

function AppointmentProposalCompleteDialog({
    inviteLink,
    onInviteExternalFriend,
    onMoveToChat,
}: {
    inviteLink: string | null;
    onInviteExternalFriend: () => void;
    onMoveToChat: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-6">
            <section
                className="w-full rounded-md bg-relink-white px-10 py-14 text-center font-display"
                role="dialog"
                aria-modal="true"
                aria-label="약속 제안 전송 완료"
            >
                <h2 className="text-xl text-relink-gray-700">약속 제안 전송 완료</h2>
                {inviteLink ? (
                    <button
                        type="button"
                        className="mt-7 h-[56px] w-full rounded-md bg-relink-lavender-soft text-md text-relink-gray-700 shadow-relink-card"
                        onClick={onInviteExternalFriend}
                    >
                        앱 미사용 친구 초대 링크 보기
                    </button>
                ) : null}
                <button
                    type="button"
                    className="mt-4 h-[64px] w-full rounded-md bg-relink-white text-lg text-relink-gray-700 shadow-relink-card"
                    onClick={onMoveToChat}
                >
                    약속 방으로 이동하기
                </button>
            </section>
        </div>
    );
}

function SelectedFriendAvatar({ friend }: { friend: AppointmentFriend }) {
    return (
        <div className="flex w-[58px] shrink-0 flex-col items-center text-center text-sm text-relink-gray-700">
            <GenericAvatar size={48} imageUrl={friend.imageUrl} />
            <p className="mt-1.5 truncate">{friend.name}</p>
        </div>
    );
}

function AppointmentActivitySection({
    selectedActivity,
    customActivity,
    onActivitySelect,
    onCustomActivityChange,
}: {
    selectedActivity: string | null;
    customActivity: string;
    onActivitySelect: (activity: string) => void;
    onCustomActivityChange: (value: string) => void;
}) {
    return (
        <section className="mt-7">
            <h2 className="text-lg text-relink-gray-400">무엇을 할까요?</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
                {activityOptions.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`h-[48px] rounded text-lg shadow-relink-card transition-colors ${
                            selectedActivity === option
                                ? 'bg-relink-lavender-intense text-relink-white'
                                : 'bg-relink-white text-relink-gray-700'
                        }`}
                        onClick={() => onActivitySelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <TextLineCard
                label="기타"
                value={customActivity}
                className="mt-3"
                onChange={onCustomActivityChange}
            />
        </section>
    );
}

function AppointmentMessageSection() {
    return (
        <section className="mt-7">
            <h2 className="text-lg text-relink-gray-400">옵션- 같이 보낼 한 줄 메시지를 입력해주세요</h2>
            <TextLineCard label="기타" className="mt-3" />
        </section>
    );
}

function TextLineCard({
    label,
    value,
    className = '',
    onChange,
}: {
    label: string;
    value?: string;
    className?: string;
    onChange?: (value: string) => void;
}) {
    return (
        <label
            className={`flex h-[50px] items-center rounded bg-relink-white px-12 text-lg text-relink-gray-700 shadow-relink-card ${className}`}
        >
            <span className="shrink-0">{label}</span>
            <input
                type="text"
                className="ml-6 min-w-0 flex-1 border-0 border-b border-relink-lavender-middle bg-transparent px-1 py-1 text-md text-relink-gray-700 outline-none"
                aria-label={label}
                value={value}
                onChange={onChange ? (event) => onChange(event.target.value) : undefined}
            />
        </label>
    );
}

function toAbsoluteInviteLink(inviteLink: string | null) {
    if (!inviteLink) {
        return null;
    }

    if (/^https?:\/\//.test(inviteLink)) {
        return inviteLink;
    }

    return `${window.location.origin}${inviteLink.startsWith('/') ? inviteLink : `/${inviteLink}`}`;
}
