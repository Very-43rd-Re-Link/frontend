import locationPinSvg from '@/assets/icons/location-pin.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { HelpBadge } from '@/components/common/nav/help-badge';

export type ScheduleCardProps = {
  title: string;
  location: string;
  time: string;
  date: string;
  groupImageSvg: string;
  memberCount: number;
};

export function ScheduleCard({
  title,
  location,
  time,
  date,
  groupImageSvg,
  memberCount,
}: ScheduleCardProps) {
  return (
    <article
      className="flex rounded border border-relink-card bg-relink-white p-4 shadow-relink-card"
    >
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-l text-relink-gray-700">{title}</h3>
          <MemberImageStack svg={groupImageSvg} count={memberCount} />
        </div>

        <div className="flex items-center gap-3">
          <InlineSvgIcon svg={locationPinSvg} className="h-7 w-6 object-contain" />
          <p className="font-display text-md text-relink-gray-700">{location}</p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <HelpBadge />
        <div className="text-right font-display text-md text-relink-gray-700">
          <p>{time}</p>
          <p>{date}</p>
        </div>
      </div>
    </article>
  );
}

function MemberImageStack({ svg, count }: { svg: string; count: number }) {
  const imageSize = 32;
  const overlapOffset = imageSize * 0.8;
  const stackWidth = imageSize + Math.max(count - 1, 0) * overlapOffset;

  return (
    <div
      className="relative h-8 shrink-0"
      style={{ width: stackWidth }}
      aria-label={`${count}명 참여`}
    >
      {Array.from({ length: count }, (_, index) => (
        <InlineSvgIcon
          key={index}
          svg={svg}
          aria-hidden="true"
          className="absolute top-0 h-6 w-6 object-contain"
          style={{ left: index * overlapOffset }}
        />
      ))}
    </div>
  );
}
