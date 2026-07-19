import { Phone, MessageCircle } from 'lucide-react'
import { telLink, whatsappLink } from '../config'

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-5 left-5 z-50 hidden flex-col gap-3 md:flex">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-black/40 transition-transform hover:scale-110"
      >
        <MessageCircle size={28} strokeWidth={2.2} />
      </a>
      <a
        href={telLink()}
        aria-label="Call now"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-night shadow-lg shadow-black/40 transition-transform hover:scale-110"
      >
        <Phone size={26} strokeWidth={2.5} />
      </a>
    </div>
  )
}
