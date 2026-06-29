import { friendList, recommendedFriends } from '@/features/friends/friend-list-data';
import { FriendsListScreen } from '@/features/friends/components/friends-list-screen';

const FriendsListView = () => {
    return <FriendsListScreen friendsCount={73} recommendedFriends={recommendedFriends} friends={friendList} />;
};

export { FriendsListView };
