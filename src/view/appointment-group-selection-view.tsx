import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import { AppointmentGroupConfirmButton } from '@/features/schedule/components/appointment-group-confirm-button';
import { appointmentGroups } from '@/features/schedule/components/appointment-group-data';
import { AppointmentGroupHeader } from '@/features/schedule/components/appointment-group-header';
import { AppointmentGroupList } from '@/features/schedule/components/appointment-group-list';

export function AppointmentGroupSelectionView() {
    const navigate = useNavigate();
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const selectedGroup = appointmentGroups.find((group) => group.id === selectedGroupId);

    const handleConfirm = () => {
        if (!selectedGroup) {
            return;
        }

        navigate(routePaths.appointmentFriends, {
            state: {
                initialSelectedFriendNames: selectedGroup.memberNames,
                skipFriendSelection: true,
            },
        });
    };

    return (
        <main className="relative flex h-full min-h-0 flex-col bg-relink-white px-5 pt-10 font-display">
            <AppointmentGroupHeader />
            <AppointmentGroupList
                groups={appointmentGroups}
                selectedGroupId={selectedGroupId}
                onSelectGroup={setSelectedGroupId}
            />
            <AppointmentGroupConfirmButton isVisible={Boolean(selectedGroup)} onConfirm={handleConfirm} />
        </main>
    );
}
