import { Navigate, Route, Routes } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import { FriendsListView } from '@/view/friend-list-view';
import { HomeScreen } from '@/view/home-screen';
import { PlaceholderView } from '@/view/placeholder-view';

export function AppRoutes() {
    return (
        <Routes>
            <Route path={routePaths.home} element={<HomeScreen />} />
            <Route
                path={routePaths.calendar}
                element={<PlaceholderView title="캘린더" description="일정 화면 라우터 예시입니다." />}
            />
            <Route path={routePaths.friends} element={<FriendsListView />} />
            <Route
                path={routePaths.chat}
                element={<PlaceholderView title="채팅" description="채팅 화면 라우터 예시입니다." />}
            />
            <Route
                path={routePaths.mypage}
                element={<PlaceholderView title="마이페이지" description="내 정보 화면 라우터 예시입니다." />}
            />
            <Route path="*" element={<Navigate to={routePaths.home} replace />} />
        </Routes>
    );
}
