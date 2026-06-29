import groupProfileSvg from '@/assets/icons/group-profile.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { AppointmentGroup } from '@/features/schedule/components/appointment-group-data';

type AppointmentGroupRowProps = {
    group: AppointmentGroup;
    isSelected: boolean;
    onSelect: () => void;
};

export function AppointmentGroupRow({ group, isSelected, onSelect }: AppointmentGroupRowProps) {
    return (
        <button
            type="button"
            className={`grid min-h-[78px] w-full grid-cols-[54px_minmax(0,1fr)] items-center gap-5 rounded-[3px] bg-relink-white px-0 py-0 text-left transition-colors ${
                isSelected ? 'border-2 border-relink-lavender-intense px-4 py-3' : 'border-2 border-transparent'
            }`}
            aria-pressed={isSelected}
            onClick={onSelect}
        >
            <InlineSvgIcon svg={groupProfileSvg} label={`${group.name} 그룹 이미지`} className="h-[54px] w-[54px]" />

            <span className="min-w-0">
                <span className="flex items-center gap-4">
                    <span className="truncate text-lg text-relink-ink">{group.name}</span>
                    <span className="text-md text-relink-gray-400">{group.memberCount}</span>
                </span>
                <span className="mt-2 flex min-w-0 items-center gap-3">
                    <span className="flex shrink-0 -space-x-1" aria-hidden="true">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <InlineSvgIcon
                                key={index}
                                svg={groupProfileSvg}
                                className="h-[18px] w-[18px] rounded-full bg-relink-lavender-soft"
                            />
                        ))}
                    </span>
                    <span className="truncate text-sm text-relink-gray-400">{group.previewText}</span>
                </span>
            </span>
        </button>
    );
}
