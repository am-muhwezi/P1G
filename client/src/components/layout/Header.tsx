import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { User } from 'lucide-react';

const navLinks = [
  { to: '/market', label: 'Marketplace' },
  { to: '/#how-it-works', label: 'How It Works', hash: true },
  { to: '/#services', label: 'Services', hash: true },
  { to: '/#about', label: 'About Us', hash: true },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (link: typeof navLinks[number]) => {
    if (link.hash) {
      if (location.pathname === '/') {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + link.to.split('/')[1]);
      }
    } else {
      navigate(link.to);
    }
  };

  return (
    <header className="w-full top-0 sticky bg-surface z-40 shadow-sm dark:bg-surface">
      <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="P1G Market" className="h-8 w-8 rounded-full" />
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">
            P1G Market
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.hash
              ? false
              : location.pathname === link.to;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`font-label-lg text-label-lg transition-opacity hover:opacity-80 bg-transparent border-none cursor-pointer ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed font-semibold'
                    : 'text-on-surface-variant dark:text-outline'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="material-symbols-outlined text-on-surface-variant dark:text-outline hover:opacity-80 transition-opacity"
          >
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-on-surface-variant dark:text-outline hover:text-on-surface dark:hover:text-primary-fixed transition-colors"
            aria-label="Sign In"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
