import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author: string;
  created_at: string;
  likes_count: number;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) {
      setArticles(data);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">المقالات</h2>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">جاري تحميل المقالات...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800 p-12 rounded-xl text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">لا توجد مقالات منشورة حالياً</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.slug}`}
              className="bg-white dark:bg-slate-800/50 rounded-lg shadow-sm overflow-hidden block hover:shadow-md transition-shadow"
            >
              {article.cover_image && (
                <div
                  className="w-full h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.cover_image})` }}
                ></div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-slate-500 dark:text-slate-400">
                  <Heart size={16} className="ml-1 text-red-500" />
                  <span className="text-sm">{article.likes_count || 0} إعجاب</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
