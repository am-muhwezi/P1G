import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/auth';

const tabs = [
  { to: '/', label: 'Market', icon: 'storefront' },
  { to: '/market', label: 'Listings', icon: 'search' },
  { to: '/login', label: 'Account', icon: 'person' },
];

export function BottomNav() {
  const location = useLocation();
  const auth = useAuth();
  const accountTab = auth.isAuthenticated ? { ...tabs[2], to: '/buyer' } : tabs[2];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 pb-2 bg-surface-container shadow-lg z-50 rounded-t-xl dark:bg-surface-dim">
      {[tabs[0], tabs[1], accountTab].map((tab) => {
        const isActive = location.pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-200 ${
              isActive
                ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1 dark:bg-primary dark:text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:text-outline-variant dark:hover:bg-surface-container-highest'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="font-label-sm text-label-sm">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
