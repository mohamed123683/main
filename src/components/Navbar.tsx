import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white">
          <span className="text-primary">د. أحمد</span> الأمير
        </Link>
        <Link
          to="/booking"
          className="hidden md:block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          احجز الآن
        </Link>
      </div>
    </header>
  );
}
