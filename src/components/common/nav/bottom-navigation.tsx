import { NavLink } from 'react-router-dom';

import calendarIcon from '@/assets/icons/calendar.svg';
import chatIcon from '@/assets/icons/chat.svg';
import friendsIcon from '@/assets/icons/friends.svg';
import homeIcon from '@/assets/icons/home.svg';
import mypageIcon from '@/assets/icons/mypage.svg';
import { routePaths } from '@/constants/route-paths';

type BottomNavigationItem = {
    label: string;
    path: string;
    source: string;
    width: number;
    height: number;
};

const navigationItems: BottomNavigationItem[] = [
    { label: '홈', path: routePaths.home, source: homeIcon, width: 43, height: 35 },
    { label: '캘린더', path: routePaths.calendar, source: calendarIcon, width: 34, height: 36 },
    { label: '친구', path: routePaths.friends, source: friendsIcon, width: 35, height: 35 },
    { label: '채팅', path: routePaths.chat, source: chatIcon, width: 34, height: 34 },
    { label: '마이페이지', path: routePaths.mypage, source: mypageIcon, width: 31, height: 31 },
];

export function BottomNavigation() {
    return (
        <nav className="z-50 flex h-[69px] flex-none items-center justify-center gap-[35px] bg-relink-white pb-[7px]">
            {navigationItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    aria-label={item.label}
                    className="flex h-[43px] w-[43px] items-center justify-center"
                >
                    {({ isActive }) => (
                        <img
                            src={item.source}
                            alt=""
                            aria-hidden="true"
                            className={`block object-contain transition-opacity ${
                                isActive ? 'opacity-100' : 'opacity-45'
                            }`}
                            style={{ width: item.width, height: item.height }}
                        />
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
