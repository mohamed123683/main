import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, MessageCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, available_slots(date, time)')
      .order('created_at', { ascending: false });
    if (data) setAppointments(data);
  };

  const sendWhatsApp = (appointment: any) => {
    const message = `تذكير بالموعد
الاسم: ${appointment.patient_name}
الهاتف: ${appointment.phone}
عمر الطفل: ${appointment.child_age}
التاريخ: ${format(parseISO(appointment.available_slots.date), 'dd/MM/yyyy')}
الوقت: ${appointment.available_slots.time}
العنوان: شارع الحاجة آمنة ناصية شارع المدارس أمام مكتبة المهندس`;

    window.open(`https://wa.me/${appointment.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الحجوزات</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم الهاتف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 px-4 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium">اسم المريض</th>
              <th className="px-6 py-3 text-right text-sm font-medium">الهاتف</th>
              <th className="px-6 py-3 text-right text-sm font-medium">عمر الطفل</th>
              <th className="px-6 py-3 text-right text-sm font-medium">التاريخ</th>
              <th className="px-6 py-3 text-right text-sm font-medium">الوقت</th>
              <th className="px-6 py-3 text-right text-sm font-medium">الملاحظات</th>
              <th className="px-6 py-3 text-right text-sm font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4">{appointment.patient_name}</td>
                <td className="px-6 py-4">{appointment.phone}</td>
                <td className="px-6 py-4">{appointment.child_age}</td>
                <td className="px-6 py-4">
                  {format(parseISO(appointment.available_slots.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4">{appointment.available_slots.time}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{appointment.notes || '-'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => sendWhatsApp(appointment)}
                    className="text-green-600 hover:text-green-700"
                    title="إرسال عبر واتساب"
                  >
                    <MessageCircle size={18} />
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
