import { useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import { AppointmentFriendFirstSelectionScreen } from '@/features/schedule/components/appointment-friend-first-selection-screen';
import {
    formatSelectedTimeLabel,
    getTimeSlotKey,
    type TimeSlot,
} from '@/features/schedule/components/appointment-friend-first-utils';
import { AppointmentOverlapTimeSelectionView } from '@/features/schedule/components/appointment-overlap-time-selection-view';
import { AppointmentProposalReview } from '@/features/schedule/components/appointment-proposal-review';
import { useAppointmentFriendFirstSelection } from '@/features/schedule/hooks/use-appointment-friend-first-selection';

export function AppointmentFriendFirstSelectionView() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        step,
        setStep,
        shouldSkipFriendSelection,
        selectedFriendIds,
        selectedFriends,
        calendarPreviewFriend,
        calendarPreviewStatus,
        selectedTimeSlots,
        setSelectedTimeSlots,
        proposalSelection,
        setProposalSelection,
        friends,
        friendLoadingStatus,
        toggleFriend,
        openCalendarPreview,
        closeCalendarPreview,
    } = useAppointmentFriendFirstSelection(location.state);

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
                        ...toAppointmentDateTimeRange(selectedTimeSlots),
                    });
                    setStep('review');
                }}
            />
        );
    }

    return (
        <AppointmentFriendFirstSelectionScreen
            friends={friends}
            selectedFriendIds={selectedFriendIds}
            calendarPreviewFriend={calendarPreviewFriend}
            calendarPreviewStatus={calendarPreviewStatus}
            friendLoadingStatus={friendLoadingStatus}
            onFriendToggle={toggleFriend}
            onCalendarOpen={openCalendarPreview}
            onCalendarClose={closeCalendarPreview}
            onBack={() => navigate(routePaths.home)}
            onNext={() => {
                setSelectedTimeSlots([]);
                setStep('time');
            }}
        />
    );
}

function toAppointmentDateTimeRange(slots: TimeSlot[]) {
    const sortedSlots = [...slots].sort((first, second) => first.dayIndex - second.dayIndex || first.time - second.time);
    const firstSlot = sortedSlots[0];
    const sameDaySlots = sortedSlots.filter((slot) => slot.dayIndex === firstSlot.dayIndex);
    const startTime = Math.min(...sameDaySlots.map((slot) => slot.time));
    const endTime = Math.max(...sameDaySlots.map((slot) => slot.time)) + 0.5;
    const date = getCurrentWeekDates()[firstSlot.dayIndex];

    return {
        startAt: toLocalDateTimeString(date, startTime),
        endAt: toLocalDateTimeString(date, endTime),
    };
}

function getCurrentWeekDates() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return date;
    });
}

function toLocalDateTimeString(date: Date, time: number) {
    const normalizedDate = new Date(date);
    if (time >= 24) {
        normalizedDate.setDate(normalizedDate.getDate() + Math.floor(time / 24));
    }

    const normalizedTime = time % 24;
    const year = normalizedDate.getFullYear();
    const month = String(normalizedDate.getMonth() + 1).padStart(2, '0');
    const day = String(normalizedDate.getDate()).padStart(2, '0');
    const hour = String(Math.floor(normalizedTime)).padStart(2, '0');
    const minute = time % 1 === 0 ? '00' : '30';

    return `${year}-${month}-${day}T${hour}:${minute}:00`;
}
