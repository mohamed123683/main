import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AdminSlots() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '' });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const { data } = await supabase
      .from('available_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    if (data) setSlots(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('available_slots').insert(formData);
    setFormData({ date: '', time: '' });
    setShowForm(false);
    fetchSlots();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموعد?')) {
      await supabase.from('available_slots').delete().eq('id', id);
      fetchSlots();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المواعيد المتاحة</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light flex items-center gap-2"
        >
          <Plus size={20} />
          إضافة موعد
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">التاريخ</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">الوقت</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium">التاريخ</th>
              <th className="px-6 py-3 text-right text-sm font-medium">الوقت</th>
              <th className="px-6 py-3 text-right text-sm font-medium">الحالة</th>
              <th className="px-6 py-3 text-right text-sm font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td className="px-6 py-4">{format(parseISO(slot.date), 'dd/MM/yyyy')}</td>
                <td className="px-6 py-4">{slot.time}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      slot.status === 'available'
                        ? 'bg-success/10 text-success'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {slot.status === 'available' ? 'متاح' : 'محجوز'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="text-red-600 hover:text-red-700"
                  >
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
