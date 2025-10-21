import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (data) setArticles(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.title.replace(/\s+/g, '-').toLowerCase();

    if (editingId) {
      await supabase.from('articles').update({ ...formData, slug }).eq('id', editingId);
    } else {
      await supabase.from('articles').insert({ ...formData, slug });
    }

    resetForm();
    fetchArticles();
  };

  const handleEdit = (article: any) => {
    setFormData(article);
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المقال?')) {
      await supabase.from('articles').delete().eq('id', id);
      fetchArticles();
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', excerpt: '', content: '', cover_image: '', published: false });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المقالات</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light flex items-center gap-2"
        >
          <Plus size={20} />
          {editingId ? 'تعديل المقال' : 'إضافة مقال'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block font-medium mb-2">العنوان *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">الملخص *</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">المحتوى *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={8}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">رابط الصورة</label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="published" className="font-medium">نشر المقال</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-success text-white px-6 py-2 rounded-lg">
              {editingId ? 'تحديث' : 'إضافة'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-200 px-6 py-2 rounded-lg">
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium">العنوان</th>
              <th className="px-6 py-3 text-right text-sm font-medium">الحالة</th>
              <th className="px-6 py-3 text-right text-sm font-medium">الإعجابات</th>
              <th className="px-6 py-3 text-right text-sm font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4">{article.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      article.published ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {article.published ? 'منشور' : 'مسودة'}
                  </span>
                </td>
                <td className="px-6 py-4">{article.likes_count}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleEdit(article)} className="text-primary hover:text-primary-light">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
