import {BottomNavigation} from '@/components/common/nav/bottom-navigation';
import {FloatingAddButton} from '@/components/common/floating-add-button';
import {FriendOverviewCard} from '@/features/home/components/friend/friend-overview-card';
import {HomeHeader} from '@/components/common/nav/home-header';
import {RecommendationSection} from '@/features/home/components/recommend/recommendation-section';
import {ScheduleSection} from '@/features/home/components/schedule-section';
import {MindMapSection} from "@/features/home/components/mind-map/mind-map-section";

export function HomeScreen() {
    return (
        <div className="relative flex h-full min-h-0 flex-col bg-relink-white">
            <HomeHeader/>

            <main className="relink-hidden-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 pb-4">
                <FriendOverviewCard/>
                <ScheduleSection/>
                <RecommendationSection/>
                <MindMapSection/>
            </main>

            <FloatingAddButton/>
            <BottomNavigation/>
        </div>
    );
}
