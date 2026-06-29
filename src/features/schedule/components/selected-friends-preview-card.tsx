import genericAvatarSvg from '@/assets/icons/generic-avatar.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type SelectedFriendsPreviewCardProps = {
    selectedFriends: AppointmentFriend[];
    onBack: () => void;
};

export function SelectedFriendsPreviewCard({ selectedFriends, onBack }: SelectedFriendsPreviewCardProps) {
    return (
        <section className="mt-3 flex h-[108px] flex-none flex-col overflow-hidden rounded bg-relink-white px-4 pb-2.5 pt-2.5 shadow-relink-card">
            <div className="flex items-center justify-between">
                <h2 className="text-[13px] leading-5 text-relink-gray-700">표시할 친구를 선택해주세요</h2>
                <button
                    type="button"
                    className="rounded bg-relink-lavender-soft px-3 py-1 text-xs text-relink-gray-700"
                    onClick={onBack}
                >
                    변경
                </button>
            </div>
            <div className="mt-1.5 flex h-[62px] items-center gap-3 overflow-hidden">
                {selectedFriends.map((friend, index) => (
                    <div
                        key={friend.name}
                        className={`flex w-[42px] shrink-0 flex-col items-center text-center text-[10px] leading-3 text-relink-gray-700 ${
                            index > 1 ? 'opacity-30' : ''
                        }`}
                    >
                        <InlineSvgIcon
                            svg={genericAvatarSvg}
                            className={`h-[38px] w-[38px] ${index < 2 ? 'rounded-full ring-2 ring-relink-lavender-intense' : ''}`}
                        />
                        <p className="mt-1 truncate">{friend.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
