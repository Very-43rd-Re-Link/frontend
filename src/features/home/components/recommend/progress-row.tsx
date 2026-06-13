import { emptySlotColor, type RingSlots, ringColorMap } from '@/features/home/constants/ring-colors';

type ProgressRowProps = {
  slots: RingSlots;
};

const PROGRESS_SLOT_COUNT = 8;

export function ProgressRow({ slots }: ProgressRowProps) {
  return (
    <div className="flex h-[5px] w-[142px]">
      {Array.from({ length: PROGRESS_SLOT_COUNT }, (_, slotIndex) => {
        const color = slots[slotIndex];

        return (
          <div
            key={slotIndex}
            className="h-[5px] w-[17.75px] rounded-[2px]"
            style={{ backgroundColor: color ? ringColorMap[color] : emptySlotColor }}
          />
        );
      })}
    </div>
  );
}
