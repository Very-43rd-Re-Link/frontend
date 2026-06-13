import logoImage from '@/assets/images/logo.png';

export function HomeHeader() {
  return (
    <header className="flex h-14 flex-none items-start justify-start p-2">
      <img src={logoImage} alt="ReLink 로고" className="h-12 w-12 object-contain" />
    </header>
  );
}
