import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Heart, ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  cover_image: string;
  author: string;
  created_at: string;
  likes_count: number;
  liked_by: string[];
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (data) {
      setArticle(data);
      setLikesCount(data.likes_count);

      const userId = localStorage.getItem('userId') || generateUserId();
      const likedBy = Array.isArray(data.liked_by) ? data.liked_by : [];
      setHasLiked(likedBy.includes(userId));
    }
    setLoading(false);
  };

  const generateUserId = () => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
    return userId;
  };

  const handleLike = async () => {
    if (!article) return;

    const userId = localStorage.getItem('userId') || generateUserId();
    const likedBy = Array.isArray(article.liked_by) ? article.liked_by : [];

    if (hasLiked) {
      const updatedLikedBy = likedBy.filter((id) => id !== userId);
      const { error } = await supabase
        .from('articles')
        .update({
          likes_count: Math.max(0, likesCount - 1),
          liked_by: updatedLikedBy,
        })
        .eq('id', article.id);

      if (!error) {
        setLikesCount(Math.max(0, likesCount - 1));
        setHasLiked(false);
      }
    } else {
      const updatedLikedBy = [...likedBy, userId];
      const { error } = await supabase
        .from('articles')
        .update({
          likes_count: likesCount + 1,
          liked_by: updatedLikedBy,
        })
        .eq('id', article.id);

      if (!error) {
        setLikesCount(likesCount + 1);
        setHasLiked(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text mb-4">المقال غير موجود</h1>
          <Link to="/articles" className="text-primary hover:underline">
            العودة إلى المقالات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div
        className="w-full bg-center bg-no-repeat bg-cover h-64 md:h-80 lg:h-96 md:rounded-lg"
        style={{
          backgroundImage: article.cover_image
            ? `url(${article.cover_image})`
            : 'url("/WhatsApp Image 2025-10-08 at 20.53.03_430897d9 copy.jpg")',
        }}
      ></div>
      <article className="p-4 md:p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{article.title}</h1>
        <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300">
          <div className="whitespace-pre-wrap leading-relaxed">{article.content}</div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 dark:hover:bg-primary/30"
          >
            <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
            <span>{likesCount}</span>
          </button>
        </div>
      </article>
    </div>
  );
}
