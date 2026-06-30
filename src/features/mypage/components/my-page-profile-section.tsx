import settingsSvg from '@/assets/icons/settings.svg';
import { FriendStatusProfile } from '@/components/common/friend-status';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { MyPageProfile } from '@/features/mypage/types';

type MyPageProfileSectionProps = {
    profile: MyPageProfile;
    onEdit: () => void;
};

export function MyPageProfileSection({ profile, onEdit }: MyPageProfileSectionProps) {
    return (
        <section className="flex items-center gap-5 px-7 py-9">
            <FriendStatusProfile
                slots={profile.slots}
                isActive={profile.isActive}
                activeColor={profile.activeColor}
                imageUrl={profile.imageUrl}
                size={70}
            />

            <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-[20px] leading-7 text-relink-ink">{profile.name}</h2>
                <p className="mt-1 truncate font-display text-sm text-relink-gray-400">{profile.bio}</p>
            </div>

            <button
                type="button"
                aria-label="프로필 편집"
                className="flex h-10 w-10 items-center justify-center"
                onClick={onEdit}
            >
                <InlineSvgIcon svg={settingsSvg} className="h-[21px] w-[21px]" />
            </button>
        </section>
    );
}
