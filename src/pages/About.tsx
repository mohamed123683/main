import { TrendingUp, MessageCircle, Baby } from 'lucide-react';

export default function About() {
  const qualifications = [
    { degree: 'دكتوراه في طب الأطفال', institution: 'جامعة القاهرة' },
    { degree: 'أخصائي طب الأطفال المعتمد', institution: 'المجلس الطبي المصري' },
    { degree: 'زميل الأكاديمية الأمريكية لطب الأطفال', institution: '2015' },
  ];

  const features = [
    {
      icon: <TrendingUp size={24} />,
      title: 'تتبع دقيق للنمو',
      description: 'نستخدم أحدث الأدوات لتتبع نمو وتطور طفلك بدقة.',
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'تواصل سريع',
      description: 'نستجيب لاستفساراتكم بسرعة وكفاءة، لضمان راحة بالكم.',
    },
    {
      icon: <Baby size={24} />,
      title: 'خبرة واسعة مع حديثي الولادة',
      description: 'د. الأمير لديه خبرة واسعة مع الأطفال حديثي الولادة.',
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <section className="mb-8 flex flex-col items-center gap-4 text-center">
        <div
          className="h-32 w-32 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: 'url("/WhatsApp Image 2025-10-08 at 20.53.03_430897d9 copy.jpg")',
          }}
        ></div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">د. أحمد الأمير</h2>
          <p className="text-slate-600 dark:text-slate-400">أخصائي طب الأطفال</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">خبرة أكثر من 10 سنوات</p>
        </div>
      </section>

      <section className="mb-8">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          د. أحمد الأمير هو أخصائي طب أطفال ذو خبرة عالية مكرس لتقديم رعاية استثنائية للأطفال من
          جميع الأعمار. مع أكثر من 10 سنوات من الخبرة، طور فهماً عميقاً لصحة ونمو الأطفال.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">
          الدرجات العلمية والشهادات
        </h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {qualifications.map((qual, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 py-4 sm:grid-cols-2">
              <p className="col-span-2 text-slate-600 dark:text-slate-400 sm:col-span-1">
                {qual.degree}
              </p>
              <p className="text-slate-800 dark:text-white sm:text-left">{qual.institution}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">لماذا تختارنا؟</h3>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">{feature.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
