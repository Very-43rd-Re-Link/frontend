import lightningIcon from '@/assets/icons/lightning.svg';
import { HelpBadge } from '@/components/common/nav/help-badge';
import { SegmentTab } from '@/features/home/components/segment-tab';

export function FriendOverviewHeader() {
  return (
    <div className="flex h-[22px] items-center">
      <div className="flex gap-1">
        <SegmentTab label="친구" />
        <SegmentTab label="그룹" />
      </div>
      <div className="ml-[13px] flex items-center gap-[13px]">
        <img src={lightningIcon} alt="" aria-hidden="true" className="h-[22px] w-[15px] object-contain" />
        <div className="h-3.5 w-3.5 rounded-full bg-relink-scheduleGreen" />
      </div>
      <HelpBadge />
    </div>
  );
}
