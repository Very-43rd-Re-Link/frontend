import type { AppointmentGroup } from '@/features/schedule/components/appointment-group-data';
import { AppointmentGroupRow } from '@/features/schedule/components/appointment-group-row';

type AppointmentGroupListProps = {
    groups: AppointmentGroup[];
    selectedGroupId: string | null;
    onSelectGroup: (groupId: string) => void;
};

export function AppointmentGroupList({ groups, selectedGroupId, onSelectGroup }: AppointmentGroupListProps) {
    return (
        <section className="relink-hidden-scrollbar mt-14 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pb-24">
            {groups.map((group) => (
                <AppointmentGroupRow
                    key={group.id}
                    group={group}
                    isSelected={selectedGroupId === group.id}
                    onSelect={() => onSelectGroup(group.id)}
                />
            ))}
        </section>
    );
}
