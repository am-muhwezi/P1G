import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container dark:bg-background dark:text-primary-fixed dark:selection:bg-primary dark:selection:text-on-primary">
      <Header />
      <main className="pb-32 md:pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
