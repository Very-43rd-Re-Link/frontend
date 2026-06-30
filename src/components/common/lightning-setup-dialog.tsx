import { useEffect, useMemo, useRef, useState } from 'react';

import lightningSvg from '@/assets/icons/lightning.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type LightningSetupDialogProps = {
    className: string;
    isSubmitting?: boolean;
    onComplete: (expiresAt: Date) => void;
};

type LightningCompleteToastProps = {
    className: string;
};

const timeItemHeight = 32;
const initialSelectedTimeIndex = 2;

export function LightningSetupDialog({
    className,
    isSubmitting = false,
    onComplete,
}: LightningSetupDialogProps) {
    const timeOptions = useMemo(() => createThirtyMinuteTimeOptions(), []);
    const [selectedIndex, setSelectedIndex] = useState(Math.min(initialSelectedTimeIndex, timeOptions.length - 1));
    const selectedTime = timeOptions[selectedIndex];
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: selectedIndex * timeItemHeight,
            behavior: 'auto',
        });
    }, []);

    const handleScroll = () => {
        const scrollTop = scrollRef.current?.scrollTop ?? 0;
        const nextIndex = clamp(Math.round(scrollTop / timeItemHeight), 0, timeOptions.length - 1);
        setSelectedIndex(nextIndex);
    };

    const handleTimeClick = (index: number) => {
        setSelectedIndex(index);
        scrollRef.current?.scrollTo({
            top: index * timeItemHeight,
            behavior: 'smooth',
        });
    };

    return (
        <section
            className={`relink-float-menu ${className} z-40 w-[324px] max-w-[calc(100vw-40px)] origin-bottom-right rounded-xl bg-relink-white px-5 py-5 font-display shadow-relink-card`}
        >
            <h2 className="text-xl text-relink-gray-700">번개 설정</h2>

            <div className="mt-6 grid grid-cols-[92px_20px_minmax(126px,1fr)] items-center gap-2">
                <div className="relative z-10 flex h-[72px] items-center justify-center rounded bg-relink-lavender-soft text-xl text-relink-ink">
                    지금
                </div>

                <div className="text-center text-xl text-relink-gray-700">~</div>

                <div className="relative h-[112px] min-w-0 overflow-hidden">
                    <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[38px] -translate-y-1/2 rounded bg-relink-lavender-soft" />
                    <div
                        ref={scrollRef}
                        className="relink-hidden-scrollbar relative h-full touch-pan-y snap-y snap-mandatory overflow-y-auto overscroll-contain"
                        onScroll={handleScroll}
                    >
                        <div style={{ height: 40 }} aria-hidden="true" />
                        {timeOptions.map((time, index) => {
                            const distance = Math.abs(index - selectedIndex);

                            return (
                                <button
                                    key={time.label}
                                    type="button"
                                    className={`flex h-8 w-full snap-center items-center justify-center bg-transparent px-1 text-lg leading-8 transition-colors ${
                                        distance === 0
                                            ? 'text-relink-ink'
                                            : distance === 1
                                              ? 'text-relink-gray-400'
                                              : 'text-relink-gray-200'
                                    }`}
                                    onClick={() => handleTimeClick(index)}
                                >
                                    {time.label}
                                </button>
                            );
                        })}
                        <div style={{ height: 40 }} aria-hidden="true" />
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-relink-white to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-relink-white to-transparent" />
                </div>
            </div>

            <button
                type="button"
                disabled={isSubmitting}
                className="mt-6 flex h-[64px] w-full items-center justify-center gap-3 rounded bg-relink-lavender-soft text-lg text-relink-ink transition-transform active:scale-[0.98] disabled:opacity-60"
                onClick={() => onComplete(selectedTime.expiresAt)}
            >
                <InlineSvgIcon svg={lightningSvg} className="h-8 w-6" />
                <span>{isSubmitting ? '번개 설정 중...' : '번개 설정 완료하기'}</span>
            </button>

            <p className="sr-only">선택한 종료 시간은 {selectedTime.label}입니다.</p>
        </section>
    );
}

export function LightningCompleteToast({ className }: LightningCompleteToastProps) {
    return (
        <div
            className={`relink-float-menu pointer-events-none ${className} z-40 flex w-[340px] max-w-[calc(100vw-40px)] origin-bottom-right items-center justify-center gap-2 rounded-xl bg-relink-white px-4 py-4 font-display shadow-relink-card`}
        >
            <InlineSvgIcon svg={lightningSvg} className="h-8 w-6" />
            <p className="text-md text-relink-ink">번개 설정이 완료되었습니다</p>
        </div>
    );
}

function createThirtyMinuteTimeOptions() {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 30);
    startDate.setMinutes(Math.ceil(startDate.getMinutes() / 30) * 30, 0, 0);

    return Array.from({ length: 18 }, (_, index) => {
        const optionDate = new Date(startDate);
        optionDate.setMinutes(startDate.getMinutes() + index * 30);
        return {
            label: formatKoreanTime(optionDate),
            expiresAt: optionDate,
        };
    });
}

function formatKoreanTime(date: Date) {
    const period = date.getHours() < 12 ? '오전' : '오후';
    const hour = date.getHours() % 12 || 12;
    const minute = `${date.getMinutes()}`.padStart(2, '0');

    return `${period} ${`${hour}`.padStart(2, '0')}:${minute}`;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
