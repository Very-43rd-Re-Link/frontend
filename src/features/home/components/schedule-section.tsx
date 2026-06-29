import genericProfileSvg from '@/assets/icons/generic-avatar.svg';
import { ScheduleCard, type ScheduleCardProps } from '@/features/home/components/schedule/schedule-card';

const schedules: ScheduleCardProps[] = [
    {
        title: '박기준 밥약',
        location: '고기 마을 신촌점',
        time: '13:00-14:30',
        date: '2026.05.30 (토)',
        groupImageSvg: genericProfileSvg,
        memberCount: 2,
    },
    {
        title: '송도 밥약',
        location: '인생분식 연세대 국제캠퍼스점',
        time: '13:00-14:30',
        date: '2026.05.30 (토)',
        groupImageSvg: genericProfileSvg,
        memberCount: 3,
    },
];

export function ScheduleSection() {
    return (
        <section className="flex flex-col gap-2 font-display">
            <p className="text-lg pb-2 text-gray-700">다가오는 약속</p>
            {schedules.map((schedule) => (
                <ScheduleCard key={`${schedule.title}-${schedule.date}-${schedule.time}`} {...schedule} />
            ))}
        </section>
    );
}
