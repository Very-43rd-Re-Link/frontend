import { hours, scheduledBlocks, weekDayLabels } from '@/features/schedule/constants';
import type { EditableSlotStatus, ScheduledBlock } from '@/features/schedule/types';

export function createInitialSlotStatuses() {
    return hours.reduce<Record<string, EditableSlotStatus>>((statuses, hour) => {
        weekDayLabels.forEach((_, dayIndex) => {
            const statusSeed = (dayIndex * 3 + hour) % 9;
            const slotKey = getSlotKey(dayIndex, hour);

            statuses[slotKey] =
                statusSeed === 0 || statusSeed === 5
                    ? 'unavailable'
                    : statusSeed === 2
                      ? 'adjustable'
                      : 'available';
        });

        return statuses;
    }, {});
}

export function createScheduledSlotMap() {
    return scheduledBlocks.reduce<Map<string, ScheduledBlock>>((slotMap, block) => {
        for (let hour = block.startHour; hour < block.endHour; hour += 1) {
            slotMap.set(getSlotKey(block.dayIndex, hour), block);
        }

        return slotMap;
    }, new Map());
}

export function getSlotKey(dayIndex: number, hour: number) {
    return `${dayIndex}-${hour}`;
}

export function getWeekDates(date: Date) {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const mondayOffset = (dateOnly.getDay() + 6) % 7;
    const monday = addDays(dateOnly, -mondayOffset);

    return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function addDays(date: Date, days: number) {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + days);
    return nextDate;
}

export function formatWeekTitle(weekDates: Date[]) {
    const firstDate = weekDates[0];
    const lastDate = weekDates[6];
    const year = firstDate.getFullYear();
    const month = `${firstDate.getMonth() + 1}`.padStart(2, '0');
    const firstDay = `${firstDate.getDate()}`.padStart(2, '0');
    const lastDay = `${lastDate.getDate()}`.padStart(2, '0');

    return `${year}년 ${month}월 ${firstDay}일 ~ ${lastDay}일`;
}
