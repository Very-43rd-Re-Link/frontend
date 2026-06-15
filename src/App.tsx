import { MobileScreenLayout } from '@/components/mobile-screen-layout';
import { BottomNavigation } from '@/components/common/nav/bottom-navigation';
import { AppRoutes } from '@/router/routes';

export default function App() {
    return (
        <MobileScreenLayout>
            <div className="relative flex h-full min-h-0 flex-col bg-relink-white">
                <AppRoutes />
                <BottomNavigation />
            </div>
        </MobileScreenLayout>
    );
}
