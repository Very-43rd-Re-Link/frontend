import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import { appointmentFriends } from '@/features/schedule/components/appointment-friend-data';
import { AppointmentFriendFirstSelectionScreen } from '@/features/schedule/components/appointment-friend-first-selection-screen';
import {
    formatSelectedTimeLabel,
    getTimeSlotKey,
    type FriendFirstStep,
    type TimeSlot,
} from '@/features/schedule/components/appointment-friend-first-utils';
import { AppointmentOverlapTimeSelectionView } from '@/features/schedule/components/appointment-overlap-time-selection-view';
import { AppointmentProposalReview } from '@/features/schedule/components/appointment-proposal-review';
import type { AppointmentSelection } from '@/features/schedule/types';

export function AppointmentFriendFirstSelectionView() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialSelectedFriendNames = getInitialSelectedFriendNames(location.state);
    const shouldSkipFriendSelection = getShouldSkipFriendSelection(location.state);
    const [step, setStep] = useState<FriendFirstStep>(shouldSkipFriendSelection ? 'time' : 'friends');
    const [selectedFriendNames, setSelectedFriendNames] = useState<string[]>(initialSelectedFriendNames);
    const [calendarPreviewName, setCalendarPreviewName] = useState<string | null>(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
    const [proposalSelection, setProposalSelection] = useState<AppointmentSelection | null>(null);
    const selectedFriends = appointmentFriends.filter((friend) => selectedFriendNames.includes(friend.name));

    const toggleFriend = (friendName: string) => {
        setSelectedFriendNames((currentNames) =>
            currentNames.includes(friendName)
                ? currentNames.filter((currentName) => currentName !== friendName)
                : [...currentNames, friendName],
        );
    };

    if (step === 'review' && proposalSelection) {
        return (
            <AppointmentProposalReview
                selection={proposalSelection}
                selectedFriends={selectedFriends}
                onBack={() => setStep('time')}
            />
        );
    }

    if (step === 'time') {
        return (
            <AppointmentOverlapTimeSelectionView
                selectedFriends={selectedFriends}
                selectedTimeSlots={selectedTimeSlots}
                onSelectedTimeSlotsChange={setSelectedTimeSlots}
                onBack={() => {
                    if (shouldSkipFriendSelection) {
                        navigate(routePaths.appointmentGroups);
                        return;
                    }

                    setStep('friends');
                }}
                onConfirm={() => {
                    setProposalSelection({
                        slotKeys: selectedTimeSlots.map((slot) => getTimeSlotKey(slot.dayIndex, slot.time)),
                        label: formatSelectedTimeLabel(selectedTimeSlots),
                    });
                    setStep('review');
                }}
            />
        );
    }

    return (
        <AppointmentFriendFirstSelectionScreen
            selectedFriendNames={selectedFriendNames}
            calendarPreviewName={calendarPreviewName}
            onFriendToggle={toggleFriend}
            onCalendarOpen={setCalendarPreviewName}
            onCalendarClose={() => setCalendarPreviewName(null)}
            onNext={() => {
                setSelectedTimeSlots([]);
                setStep('time');
            }}
        />
    );
}

function getInitialSelectedFriendNames(state: unknown) {
    if (!state || typeof state !== 'object' || !('initialSelectedFriendNames' in state)) {
        return [];
    }

    const { initialSelectedFriendNames } = state as { initialSelectedFriendNames?: unknown };

    if (!Array.isArray(initialSelectedFriendNames)) {
        return [];
    }

    const appointmentFriendNameSet = new Set(appointmentFriends.map((friend) => friend.name));

    return initialSelectedFriendNames.filter(
        (friendName): friendName is string => typeof friendName === 'string' && appointmentFriendNameSet.has(friendName),
    );
}

function getShouldSkipFriendSelection(state: unknown) {
    return Boolean(state && typeof state === 'object' && 'skipFriendSelection' in state && state.skipFriendSelection);
}
