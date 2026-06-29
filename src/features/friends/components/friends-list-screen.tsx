import { useState } from 'react';

import { FriendDetailSection } from '@/features/friends/components/friend-detail-section';
import { FriendList } from '@/features/friends/components/friend-list';
import { FriendListHeader } from '@/features/friends/components/friend-list-header';
import { FriendSearchBar } from '@/features/friends/components/friend-search-bar';

export function FriendsListScreen() {
    const [keyword, setKeyword] = useState('');
    const [friendsCount, setFriendsCount] = useState(0);

    return (
        <main className="relative flex min-h-0 flex-1 flex-col gap-5 bg-relink-white px-5 pt-10">
            <FriendListHeader friendsCount={friendsCount} />
            <FriendDetailSection memberName="회원 이름" />
            <FriendSearchBar value={keyword} onChange={setKeyword} />
            <FriendList
                keyword={keyword}
                sortLabel="기본"
                referenceTime="20:30"
                onFriendsCountChange={setFriendsCount}
            />
        </main>
    );
}
