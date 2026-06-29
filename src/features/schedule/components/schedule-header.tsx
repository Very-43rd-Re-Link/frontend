import { HelpBadge } from '@/components/common/nav/help-badge';
import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type ScheduleHeaderProps = {
    title?: string;
};

export function ScheduleHeader({ title = '캘린더' }: ScheduleHeaderProps) {
    return (
        <header className="flex items-center justify-between font-display">
            <div className="flex items-end justify-between gap-1">
                <div>
                    <h1 className="text-2xl text-gray-700">{title}</h1>
                </div>
            </div>

            <div className="flex items-center gap-3 text-relink-lavender-intense">
                <button type="button" aria-label={`${title} 도움말`} className="flex h-6 w-6 items-center justify-center">
                    <HelpBadge size={18} />
                </button>
                <button
                    type="button"
                    aria-label={`${title} 설정`}
                    className="flex h-6 w-6 items-center justify-center"
                >
                    <InlineSvgIcon svg={settingsSvg} className="h-[18px] w-[18px] object-contain" />
                </button>
            </div>
        </header>
    );
}
