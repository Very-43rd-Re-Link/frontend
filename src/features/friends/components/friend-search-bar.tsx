import searchSvg from '@/assets/icons/search.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { FriendSearchBarProps } from '@/features/friends/types';

export function FriendSearchBar({ label = '친구 검색' }: FriendSearchBarProps) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex w-full justify-start rounded-lg border-relink-card bg-relink-white p-2 shadow-relink-card"
        >
            <InlineSvgIcon svg={searchSvg} />
        </button>
    );
}
