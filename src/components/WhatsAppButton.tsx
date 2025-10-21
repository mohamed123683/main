import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappNumber = '+201234567890';
  const message = 'مرحباً، أرغب في الاستفسار عن خدمات العيادة';

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-40"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle size={28} />
    </button>
  );
}
