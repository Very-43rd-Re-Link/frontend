import { HelpBadge } from '@/components/common/nav/help-badge';
import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type ScheduleHeaderProps = {
    title?: string;
    onBack?: () => void;
};

export function ScheduleHeader({ title = '캘린더', onBack }: ScheduleHeaderProps) {
    return (
        <header className="flex items-center justify-between font-display">
            <div className="flex items-center gap-3">
                {onBack ? (
                    <button
                        type="button"
                        className="rounded-md bg-relink-lavender-soft px-3 py-1.5 text-sm text-relink-gray-700"
                        onClick={onBack}
                    >
                        뒤로
                    </button>
                ) : null}
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
