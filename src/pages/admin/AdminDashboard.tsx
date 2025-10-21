import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    totalAppointments: 0,
    totalArticles: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentAppointments();
  }, []);

  const fetchStats = async () => {
    const [slotsData, appointmentsData, articlesData] = await Promise.all([
      supabase.from('available_slots').select('status', { count: 'exact' }),
      supabase.from('appointments').select('id', { count: 'exact' }),
      supabase.from('articles').select('id', { count: 'exact' }),
    ]);

    const availableSlots = await supabase
      .from('available_slots')
      .select('id', { count: 'exact' })
      .eq('status', 'available');

    setStats({
      totalSlots: slotsData.count || 0,
      availableSlots: availableSlots.count || 0,
      totalAppointments: appointmentsData.count || 0,
      totalArticles: articlesData.count || 0,
    });
  };

  const fetchRecentAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, available_slots(date, time)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentAppointments(data);
    }
    setLoading(false);
  };

  const statCards = [
    {
      title: 'إجمالي المواعيد',
      value: stats.totalSlots,
      icon: <Calendar size={32} className="text-primary" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'المواعيد المتاحة',
      value: stats.availableSlots,
      icon: <Clock size={32} className="text-success" />,
      bg: 'bg-green-50',
    },
    {
      title: 'الحجوزات',
      value: stats.totalAppointments,
      icon: <Users size={32} className="text-orange-500" />,
      bg: 'bg-orange-50',
    },
    {
      title: 'المقالات',
      value: stats.totalArticles,
      icon: <FileText size={32} className="text-purple-500" />,
      bg: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} p-6 rounded-xl shadow-sm border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-4">
              {card.icon}
              <span className="text-3xl font-bold text-text">{card.value}</span>
            </div>
            <h3 className="text-gray-700 font-medium">{card.title}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-text">أحدث الحجوزات</h2>
        </div>
        <div className="overflow-x-auto">
          {recentAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-600">لا توجد حجوزات</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    اسم المريض
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    عمر الطفل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الوقت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentAppointments.map((appointment: any) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-text">{appointment.patient_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.child_age}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {appointment.available_slots?.date
                        ? format(parseISO(appointment.available_slots.date), 'dd/MM/yyyy', {
                            locale: ar,
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {appointment.available_slots?.time || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed'
                            ? 'bg-success/10 text-success'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {appointment.status === 'confirmed'
                          ? 'مؤكد'
                          : appointment.status === 'cancelled'
                          ? 'ملغى'
                          : 'مكتمل'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
