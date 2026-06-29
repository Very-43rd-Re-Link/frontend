import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type AppointmentFriendSelectionHeaderProps = {
    selectionLabel: string;
};

export function AppointmentFriendSelectionHeader({ selectionLabel }: AppointmentFriendSelectionHeaderProps) {
    return (
        <header className="flex flex-none items-start justify-between gap-3">
            <div className="min-w-0">
                <h1 className="text-xl text-relink-gray-700">친구 목록</h1>
                <p className="mt-1 text-md text-relink-gray-400">{selectionLabel}</p>
                <p className="mt-1 text-sm text-relink-gray-200">*앱 미사용 친구는 다음 화면에서 초대할 수 있어요</p>
            </div>

            <div className="flex shrink-0 items-center gap-3 pt-1 text-relink-lavender-intense">
                <button type="button" className="flex h-8 w-8 items-center justify-center" aria-label="친구 목록 설정">
                    <InlineSvgIcon svg={settingsSvg} className="h-7 w-7" />
                </button>
                <button
                    type="button"
                    className="h-9 rounded-md border-2 border-relink-lavender-intense px-5 text-md text-relink-gray-700"
                >
                    정렬
                </button>
            </div>
        </header>
    );
}
