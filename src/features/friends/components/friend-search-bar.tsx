import searchIcon from '@/assets/icons/search.svg';
import type { FriendSearchBarProps } from '@/features/friends/types';

export function FriendSearchBar({ label = '친구 검색' }: FriendSearchBarProps) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex w-full justify-start rounded-lg border-relink-card bg-relink-white p-2 shadow-relink-card"
        >
            <img src={searchIcon} alt="" aria-hidden="true" />
        </button>
    );
}
