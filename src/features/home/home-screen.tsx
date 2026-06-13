import { GenericAvatar } from '@/components/generic-avatar';
import { MobileScreenLayout } from '@/components/mobile-screen-layout';
import lightningIcon from '../../../assets/icons/lightning.svg';
import logoImage from '../../../assets/images/logo.png';
import { BottomNavigation } from './components/bottom-navigation';

const friends = [
  { name: '김가영', colors: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'] },
  { name: '김다영', colors: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'] },
  { name: '김마영', colors: ['cyan', 'cyan', 'cyan', 'yellow', 'yellow', 'yellow', 'cyan', 'cyan'] },
  { name: '김사영', colors: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'] },
] as const;

const recommendationCards = [
  {
    title: '추천 1',
    date: '06/10 (일)',
    names: ['김마영', '김바영', '김사영', '김아영'],
    bars: [
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'yellow', 'yellow'],
    ],
    shadow: true,
  },
  {
    title: '추천 2',
    date: '06/09 (토)',
    names: ['김가영', '김나영', '김다영', '김라영'],
    bars: [
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'yellow'],
      ['yellow', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
    ],
    shadow: false,
  },
] as const;

type RingColor = 'cyan' | 'green' | 'yellow';

export function HomeScreen() {
  return (
    <MobileScreenLayout>
      <div className="h-full px-3 pb-[62px]">
        <header className="flex h-14 items-start justify-start pl-[19px] pt-2">
          <img src={logoImage} alt="ReLink 로고" className="h-7 w-7 object-contain" />
        </header>

        <FriendOverviewCard />

        <section className="mt-[50px] flex flex-col gap-[5px]">
          <ScheduleCard />
          <ScheduleCard shadow />
        </section>

        <div className="flex h-[39px] items-end justify-end pb-2 pr-[5px]">
          <p className="font-display text-[12px] leading-[14px] text-black/70">추천 더보기</p>
        </div>

        <section className="flex">
          {recommendationCards.map((card) => (
            <RecommendationCard key={card.title} {...card} />
          ))}
        </section>

        <div className="shadow-relink-card mx-[5px] mt-[49px] h-[29px] rounded border border-relink-card bg-relink-white" />
      </div>

      <FloatingAddButton />
      <BottomNavigation />
    </MobileScreenLayout>
  );
}

function FriendOverviewCard() {
  return (
    <section className="shadow-relink-card h-[125px] rounded-[10px] border border-relink-card bg-relink-white px-[13px] pt-[13px]">
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

      <div className="flex flex-1 items-start justify-between px-[5px] pt-[3px]">
        {friends.map((friend) => (
          <div key={friend.name} className="flex w-14 flex-col items-center">
            <PercentRing colors={friend.colors} />
            <p className="mt-[3px] text-center font-display text-[8px] leading-[10px] text-relink-ink">
              {friend.name}
            </p>
          </div>
        ))}
        <div className="flex w-14 flex-col items-center">
          <GenericAvatar size={40} />
          <p className="mt-[3px] text-center font-display text-[8px] leading-[10px] text-relink-ink">
            김자영
          </p>
        </div>
      </div>
    </section>
  );
}

function SegmentTab({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[22px] w-[49px] items-center justify-center rounded-[7px] bg-relink-lavender-soft font-display text-[12px] leading-[14px] text-relink-ink">
      {label}
    </button>
  );
}

function PercentRing({ colors }: { colors: readonly RingColor[] }) {
  return (
    <div className="relative h-[55px] w-14">
      {colors.map((color, index) => {
        const angle = index * 45 - 90;
        const radians = (angle * Math.PI) / 180;
        const x = 27.5 + 23 * Math.cos(radians) - 5;
        const y = 27.5 + 23 * Math.sin(radians) - 5;

        return (
          <div
            key={`${color}-${index}`}
            className="absolute h-3 w-3 rounded-full"
            style={{ backgroundColor: ringColorMap[color], left: x, top: y }}
          />
        );
      })}
    </div>
  );
}

function ScheduleCard({ shadow = false }: { shadow?: boolean }) {
  return (
    <article
      className={`flex h-[68px] items-end justify-between rounded border border-relink-card bg-relink-white pb-[13px] pl-3.5 pr-[13px] pt-2 ${
        shadow ? 'shadow-relink-card' : ''
      }`}>
      <LocationPin />
      <HelpBadge />
    </article>
  );
}

type RecommendationCardProps = (typeof recommendationCards)[number];

function RecommendationCard({ title, date, names, bars, shadow }: RecommendationCardProps) {
  return (
    <article
      className={`h-[197px] w-[172px] rounded border border-relink-card bg-relink-white px-[15px] pt-3.5 ${
        shadow ? 'shadow-relink-card' : ''
      }`}>
      <div className="flex h-4 items-center gap-[13px]">
        <h2 className="font-display text-[13px] leading-4 text-relink-ink">{title}</h2>
        <span className="flex h-4 min-w-[46px] items-center justify-center rounded-full bg-relink-lavender-soft px-2 font-display text-[9px] leading-[11px] text-relink-gray-700">
          약속 잡기
        </span>
      </div>
      <div className="mt-[3px] flex items-center gap-2">
        <p className="font-display text-[9px] leading-[11px] text-relink-gray-700">{date}</p>
        <p className="font-display text-[9px] leading-[11px] text-relink-gray-400">18:00 - 22:00</p>
      </div>

      <div className="mt-3.5 flex flex-col gap-3.5">
        {names.map((name, index) => (
          <div key={name} className="flex h-[26px] flex-col items-center justify-between">
            <p className="font-display text-[8.5px] leading-[11px] text-relink-ink">{name}</p>
            {index < bars.length ? <ProgressRow colors={bars[index]} /> : <div className="h-[5px] w-[142px]" />}
          </div>
        ))}
      </div>
    </article>
  );
}

function ProgressRow({ colors }: { colors: readonly RingColor[] }) {
  return (
    <div className="flex h-[5px] w-[142px]">
      {colors.map((color, index) => (
        <div
          key={`${color}-${index}`}
          className="h-[5px] w-[17.75px] rounded-[2px]"
          style={{ backgroundColor: ringColorMap[color] }}
        />
      ))}
    </div>
  );
}

function HelpBadge() {
  return (
    <span className="ml-auto flex h-[15px] w-[15px] items-center justify-center rounded-full border-[1.6px] border-relink-lavender-intense text-center text-[10px] font-bold leading-[13px] text-relink-lavender-intense">
      ?
    </span>
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

function FloatingAddButton() {
  return (
    <button
      type="button"
      aria-label="추가"
      className="absolute bottom-[37px] right-[27px] flex h-14 w-14 items-center justify-center rounded-full bg-relink-lavender-intense">
      <span className="text-[48px] font-semibold leading-[54px] text-relink-white">+</span>
    </button>
  );
}

const ringColorMap = {
  cyan: '#61dddd',
  green: '#74dc94',
  yellow: '#fee73d',
} as const;
