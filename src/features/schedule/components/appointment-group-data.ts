export type AppointmentGroup = {
    id: string;
    name: string;
    memberCount: number;
    memberNames: string[];
    previewText: string;
};

export const appointmentGroups: AppointmentGroup[] = [
    {
        id: 'gukbap',
        name: '국밥팟',
        memberCount: 6,
        memberNames: ['김마영', '김바영', '김사영', '김아영', '김자영'],
        previewText: '나, 김마영, 김바영, 김사영, 김아영, 김자영',
    },
    {
        id: 'research-lab',
        name: '현우진 연구실 조교방',
        memberCount: 22,
        memberNames: ['김가영', '김나영', '김다영', '김라영', '김마영'],
        previewText: '나, 박기준, 박나준, 박다준, 박라준 외 17명',
    },
    {
        id: 'lol-party',
        name: '롤팟',
        memberCount: 4,
        memberNames: ['김가영', '김나영', '김다영', '김라영'],
        previewText: '나, 김가영, 김나영, 김다영, 김라영',
    },
    {
        id: 'engineering-council',
        name: '22대 공학 10반 학생회',
        memberCount: 12,
        memberNames: ['김가영', '김나영', '김다영', '김라영', '김마영'],
        previewText: '나, 박기준, 박나준, 박다준, 박라준 외 7명',
    },
];
