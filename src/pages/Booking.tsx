import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface Slot {
  id: string;
  date: string;
  time: string;
  status: 'available' | 'booked';
}

export default function Booking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    childAge: '',
    notes: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('available_slots')
      .select('*')
      .eq('status', 'available')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (data) {
      setSlots(data);
    }
    setLoading(false);
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setShowForm(true);
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setLoading(true);
    setMessage(null);

    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('slot_id', selectedSlot.id)
      .maybeSingle();

    if (existingAppointment) {
      setMessage({
        type: 'error',
        text: 'عذراً، هذا الموعد تم حجزه بالفعل. الرجاء اختيار موعد آخر.',
      });
      setLoading(false);
      fetchAvailableSlots();
      setShowForm(false);
      setSelectedSlot(null);
      return;
    }

    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        slot_id: selectedSlot.id,
        patient_name: formData.patientName,
        phone: formData.phone,
        child_age: formData.childAge,
        notes: formData.notes,
        status: 'confirmed',
      })
      .select()
      .single();

    if (appointmentError) {
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء الحجز. الرجاء المحاولة مرة أخرى.',
      });
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('available_slots')
      .update({ status: 'booked' })
      .eq('id', selectedSlot.id);

    if (!updateError) {
      setMessage({
        type: 'success',
        text: 'تم حجز موعدك بنجاح! جاري فتح واتساب لتأكيد الحجز...',
      });

      const whatsappMessage = `حجز جديد من الموقع
الاسم: ${formData.patientName}
الهاتف: ${formData.phone}
عمر الطفل: ${formData.childAge}
التاريخ: ${format(parseISO(selectedSlot.date), 'dd MMMM yyyy', { locale: ar })}
الوقت: ${selectedSlot.time}
العنوان: شارع الحاجة آمنة ناصية شارع المدارس أمام مكتبة المهندس
${formData.notes ? `ملاحظات: ${formData.notes}` : ''}`;

      const whatsappUrl = `https://wa.me/+201234567890?text=${encodeURIComponent(whatsappMessage)}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

      setFormData({
        patientName: '',
        phone: '',
        childAge: '',
        notes: '',
      });
      setShowForm(false);
      setSelectedSlot(null);
      fetchAvailableSlots();
    }

    setLoading(false);
  };

  const groupSlotsByDate = () => {
    const grouped: { [key: string]: Slot[] } = {};
    slots.forEach((slot) => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getAvailableSlotsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return slots.filter((slot) => slot.date === dateStr && slot.status === 'available');
  };

  const availableSlotsForSelectedDate = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">احجز موعداً</h1>

      {message && (
        <div
          className={`mb-8 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-success/10 text-success border border-success/30'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800/20 rounded-xl shadow-sm p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-slate-600 dark:text-slate-300 hover:text-primary"
          >
            <ChevronRight size={20} />
          </button>
          <p className="text-lg font-semibold text-slate-800 dark:text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: ar })}
          </p>
          <button
            onClick={handleNextMonth}
            className="text-slate-600 dark:text-slate-300 hover:text-primary"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {['ح', 'ن', 'ث', 'ع', 'خ', 'ج', 'س'].map((day) => (
            <div key={day} className="font-medium text-slate-500 dark:text-slate-400">
              {day}
            </div>
          ))}
          {daysInMonth.map((day, idx) => {
            const daySlots = getAvailableSlotsForDate(day);
            const hasSlots = daySlots.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            return (
              <div key={idx} className="py-2">
                {isSameMonth(day, currentMonth) && (
                  <button
                    onClick={() => hasSlots && handleDateSelect(day)}
                    disabled={!hasSlots}
                    className={`w-8 h-8 rounded-full ${
                      isSelected
                        ? 'bg-primary text-white'
                        : isCurrentDay
                        ? 'bg-primary/20 dark:bg-primary/30 text-primary dark:text-white'
                        : hasSlots
                        ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                        : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {format(day, 'd')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            المواعيد المتاحة لـ {format(selectedDate, 'dd MMMM yyyy', { locale: ar })}
          </h2>
          {availableSlotsForSelectedDate.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-8">
              {availableSlotsForSelectedDate.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`px-4 py-2 rounded font-medium ${
                    selectedSlot?.id === slot.id
                      ? 'bg-primary text-white'
                      : 'bg-primary/20 dark:bg-primary/30 text-primary dark:text-white'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              لا توجد مواعيد متاحة في هذا اليوم.
            </p>
          )}
        </div>
      )}

      {showForm && selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full bg-white dark:bg-slate-800/20 border-0 rounded-lg p-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary"
            placeholder="الاسم الكامل"
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full bg-white dark:bg-slate-800/20 border-0 rounded-lg p-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary"
            placeholder="رقم الهاتف"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full bg-white dark:bg-slate-800/20 border-0 rounded-lg p-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary"
            placeholder="عمر الطفل"
            type="text"
            name="childAge"
            value={formData.childAge}
            onChange={handleInputChange}
            required
          />
          <textarea
            className="w-full bg-white dark:bg-slate-800/20 border-0 rounded-lg p-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary"
            placeholder="ملاحظات إضافية (اختياري)"
            rows={4}
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-slate-400"
          >
            {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
          </button>
        </form>
      )}
    </div>
  );
}
