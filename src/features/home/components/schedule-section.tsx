import { HelpBadge } from '@/components/common/help-badge';

export function ScheduleSection() {
  return (
    <section className="mt-[50px] flex flex-col gap-[5px]">
      <ScheduleCard />
      <ScheduleCard shadow />
    </section>
  );
}

function ScheduleCard({ shadow = false }: { shadow?: boolean }) {
  return (
    <article
      className={`flex h-[68px] items-end justify-between rounded border border-relink-card bg-relink-white pb-[13px] pl-3.5 pr-[13px] pt-2 ${
        shadow ? 'shadow-relink-card' : ''
      }`}
    >
      <LocationPin />
      <HelpBadge />
    </article>
  );
}

function LocationPin() {
  return (
    <div className="flex h-[22px] w-[18px] flex-col items-center">
      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-relink-lavender-intense bg-relink-white">
        <div className="h-1 w-1 rounded-full bg-relink-lavender-intense" />
      </div>
      <div className="-mt-[3px] h-[9px] w-[9px] rotate-45 border-b-2 border-r-2 border-relink-lavender-intense bg-relink-white" />
    </div>
  );
}
