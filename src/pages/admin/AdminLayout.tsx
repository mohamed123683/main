import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navLinks = [
    { name: 'الإحصائيات', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'المواعيد', path: '/admin/slots', icon: <Calendar size={20} /> },
    { name: 'الحجوزات', path: '/admin/appointments', icon: <Users size={20} /> },
    { name: 'المقالات', path: '/admin/articles', icon: <FileText size={20} /> },
    { name: 'الإعدادات', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside
          className={`fixed right-0 top-0 h-screen bg-white shadow-xl z-50 transition-transform lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } w-64`}
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/WhatsApp Image 2025-10-08 at 20.53.03_430897d9 copy.jpg"
                  alt="شعار العيادة"
                  className="h-12 w-12 object-contain rounded-full"
                />
                <div>
                  <h2 className="font-bold text-text">لوحة التحكم</h2>
                  <p className="text-xs text-gray-600">د. أحمد الأمير</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-gray-600 hover:text-primary"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 lg:mr-64">
          <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center justify-between">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-gray-700 hover:text-primary"
              >
                <Menu size={28} />
              </button>
              <h1 className="text-xl font-bold text-text">
                {navLinks.find((link) => isActive(link.path))?.name || 'لوحة التحكم'}
              </h1>
              <div className="w-8 lg:hidden"></div>
            </div>
          </header>

          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
