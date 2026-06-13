import { BottomNavigation } from '@/features/home/components/bottom-navigation';
import { FloatingAddButton } from '@/features/home/components/floating-add-button';
import { FriendOverviewCard } from '@/features/home/components/friend-overview-card';
import { HomeHeader } from '@/features/home/components/home-header';
import { RecommendationSection } from '@/features/home/components/recommendation-section';
import { ScheduleSection } from '@/features/home/components/schedule-section';

export function HomeScreen() {
  return (
    <div className="relative flex h-dvh flex-col bg-relink-white">
      <HomeHeader />

      <main className="flex flex-1 flex-col overflow-y-auto px-3 pb-4">
        <FriendOverviewCard />
        <ScheduleSection />
        <RecommendationSection />
        <div className="mx-[5px] mt-[49px] h-[29px] rounded border border-relink-card bg-relink-white shadow-relink-card" />
      </main>

      <FloatingAddButton />
      <BottomNavigation />
    </div>
  );
}
