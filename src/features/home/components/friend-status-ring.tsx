import { type RingColor, ringColorMap } from '@/features/home/constants/ring-colors';

type FriendStatusRingProps = {
  colors: readonly RingColor[];
};

const ringSlots = Array.from({ length: 8 }, (_, index) => {
  const angle = index * 45 - 90;
  const radians = (angle * Math.PI) / 180;

  return {
    cx: 28 + 23 * Math.cos(radians),
    cy: 28 + 23 * Math.sin(radians),
  };
});

export function FriendStatusRing({ colors }: FriendStatusRingProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      className="h-[55px] w-14"
      role="img"
      aria-label="친구 가능 시간 상태"
    >
      {colors.map((color, index) => {
        const slot = ringSlots[index];

        return (
          <circle
            key={`${color}-${index}`}
            cx={slot.cx}
            cy={slot.cy}
            r="6"
            fill={ringColorMap[color]}
          />
        );
      })}
    </svg>
  );
}
