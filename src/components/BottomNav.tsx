import { Link, useLocation } from 'react-router-dom';
import { Home, Info, FileText, Calendar, Phone } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'عن الدكتور', path: '/about', icon: Info },
    { name: 'المقالات', path: '/articles', icon: FileText },
    { name: 'الحجز', path: '/booking', icon: Calendar },
    { name: 'تواصل', path: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-800/50 md:hidden">
      <div className="flex justify-around p-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                active
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
