import { useParams } from 'react-router-dom';

import { InviteAcceptanceScreen } from '@/features/invite/components/invite-acceptance-screen';

export function InviteAcceptanceView() {
    const { inviteToken } = useParams();

    return <InviteAcceptanceScreen inviteToken={inviteToken} />;
}
