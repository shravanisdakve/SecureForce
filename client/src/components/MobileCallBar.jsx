import { Link } from 'react-router-dom'
import { Phone, MessageCircle, FileText } from 'lucide-react'
import { useSite } from '../siteContext'

export default function MobileCallBar() {
  const { telLink, whatsappLink } = useSite()
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-white/10 bg-night-800/95 backdrop-blur-md md:hidden">
      <a
        href={telLink()}
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-brand"
      >
        <Phone size={20} strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-wide">Call</span>
      </a>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-green-400"
      >
        <MessageCircle size={20} strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-wide">WhatsApp</span>
      </a>
      <Link
        to="/contact"
        className="flex flex-col items-center justify-center gap-0.5 bg-brand py-2.5 text-night"
      >
        <FileText size={20} strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-wide">Quote</span>
      </Link>
    </div>
  )
}
