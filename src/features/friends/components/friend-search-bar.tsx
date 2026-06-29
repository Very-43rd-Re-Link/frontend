import searchSvg from '@/assets/icons/search.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { FriendSearchBarProps } from '@/features/friends/types';

export function FriendSearchBar({
    value,
    onChange,
    placeholder = '친구 검색',
}: FriendSearchBarProps) {
    return (
        <label className="flex w-full items-center gap-2 rounded-lg border-relink-card bg-relink-white p-2 shadow-relink-card">
            <InlineSvgIcon svg={searchSvg} />
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent font-display text-md text-relink-ink outline-none placeholder:text-gray-400"
            />
        </label>
    );
}
