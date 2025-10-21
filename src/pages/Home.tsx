import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  created_at: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  const fetchLatestArticles = async () => {
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, cover_image, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) {
      setArticles(data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-16">
        <div className="flex flex-col justify-center gap-6 text-center md:text-right">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-5xl">
            صحة طفلك، أولويتنا
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            مرحباً بكم في عيادة د. أحمد الأمير، حيث نقدم رعاية طبية متخصصة ومتكاملة لأطفالكم الأعزاء.
          </p>
          <div className="mt-4 flex justify-center md:justify-start">
            <Link
              to="/booking"
              className="rounded-lg bg-primary px-8 py-3 text-base font-bold text-white transition-transform hover:scale-105"
            >
              احجز موعداً
            </Link>
          </div>
        </div>
        <div className="order-first md:order-last">
          <div
            className="aspect-square w-full rounded-xl bg-cover bg-center md:aspect-auto md:h-full"
            style={{
              backgroundImage:
                'url("/WhatsApp Image 2025-10-08 at 20.53.03_430897d9 copy.jpg")',
            }}
          ></div>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="py-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-white">
            أحدث المقالات
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800 hover:shadow-md transition-shadow"
              >
                {article.cover_image && (
                  <div
                    className="aspect-video w-full rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.cover_image})` }}
                  ></div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-white">
          تواصل معنا
        </h2>
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone size={24} />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">الهاتف</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">+20 123 456 7890</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail size={24} />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">البريد الإلكتروني</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                info@dr-ahmed-alamir.com
              </p>
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
      </section>
    </div>
  );
}
