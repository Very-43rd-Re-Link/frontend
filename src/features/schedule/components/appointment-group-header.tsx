import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { HelpBadge } from '@/components/common/nav/help-badge';

export function AppointmentGroupHeader() {
    return (
        <header className="flex flex-none items-start justify-between gap-4">
            <h1 className="text-[31px] leading-[42px] text-relink-gray-700">
                약속을 잡고 싶은 그룹을
                <br />
                선택해주세요
            </h1>

            <div className="mt-[78px] flex shrink-0 items-center gap-3 text-relink-lavender-intense">
                <button type="button" aria-label="그룹 선택 도움말" className="flex h-6 w-6 items-center justify-center">
                    <HelpBadge size={18} />
                </button>
                <button type="button" aria-label="그룹 선택 설정" className="flex h-6 w-6 items-center justify-center">
                    <InlineSvgIcon svg={settingsSvg} className="h-[18px] w-[18px]" />
                </button>
            </div>
        </header>
    );
}
