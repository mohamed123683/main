export default function Footer() {
  return (
    <footer className="hidden md:block bg-slate-900 text-slate-300 py-8">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm">
          جميع الحقوق محفوظة © {new Date().getFullYear()} عيادة د. أحمد الأمير
        </p>
      </div>
    </footer>
  );
}
