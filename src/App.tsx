import { MobileScreenLayout } from '@/components/mobile-screen-layout';
import { HomeScreen } from '@/features/home/home-screen';

export default function App() {
  return (
    <MobileScreenLayout>
      <HomeScreen />
    </MobileScreenLayout>
  );
}
