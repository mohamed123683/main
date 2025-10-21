import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    doctor_info: {},
    contact_info: {},
    working_hours: {},
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('clinic_settings').select('*');
    if (data) {
      const settingsMap: any = {};
      data.forEach((item) => {
        settingsMap[item.key] = item.value;
      });
      setSettings(settingsMap);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from('clinic_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    }

    setMessage('تم حفظ الإعدادات بنجاح!');
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const updateDoctorInfo = (field: string, value: string) => {
    setSettings({
      ...settings,
      doctor_info: { ...settings.doctor_info, [field]: value },
    });
  };

  const updateContactInfo = (field: string, value: string) => {
    setSettings({
      ...settings,
      contact_info: { ...settings.contact_info, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الإعدادات</h2>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light flex items-center gap-2"
        >
          <Save size={20} />
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {message && (
        <div className="bg-success/10 text-success p-4 rounded-lg border border-success/30">
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-4">معلومات الدكتور</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">الاسم</label>
              <input
                type="text"
                value={settings.doctor_info?.name || ''}
                onChange={(e) => updateDoctorInfo('name', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">التخصص</label>
              <input
                type="text"
                value={settings.doctor_info?.specialty || ''}
                onChange={(e) => updateDoctorInfo('specialty', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">السيرة الذاتية</label>
              <textarea
                value={settings.doctor_info?.bio || ''}
                onChange={(e) => updateDoctorInfo('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4">معلومات التواصل</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={settings.contact_info?.phone || ''}
                onChange={(e) => updateContactInfo('phone', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">رقم الواتساب</label>
              <input
                type="tel"
                value={settings.contact_info?.whatsapp || ''}
                onChange={(e) => updateContactInfo('whatsapp', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">العنوان</label>
              <input
                type="text"
                value={settings.contact_info?.address || ''}
                onChange={(e) => updateContactInfo('address', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={settings.contact_info?.email || ''}
                onChange={(e) => updateContactInfo('email', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
