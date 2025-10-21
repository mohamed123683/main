import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">تواصل معنا</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Phone size={24} />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">الهاتف</p>
            <a href="tel:+201234567890" className="text-sm text-slate-600 dark:text-slate-400">
              +20 123 456 7890
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail size={24} />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">البريد الإلكتروني</p>
            <a
              href="mailto:info@dr-ahmed-alamir.com"
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              info@dr-ahmed-alamir.com
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin size={24} />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">العنوان</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              شارع الحاجة آمنة ناصية شارع المدارس أمام مكتبة المهندس
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
