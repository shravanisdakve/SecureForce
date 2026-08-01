import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { SITE } from '../config'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt={`${SITE.shortName} logo`} className="h-9 w-auto rounded-md object-contain" />
            <span className="text-lg font-bold text-white">{SITE.shortName}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-night-200">
            {SITE.tagline} in {SITE.city}. Trusted manpower for events,
            residential, corporate, and institutional needs — available {SITE.hours.toLowerCase()}.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-night-100">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Request a Quote</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-night-100">
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-brand" />
              <a href={`tel:${SITE.phoneHref}`} className="hover:text-white">{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-brand" />
              <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-brand" />
              {SITE.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-night-200">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  )
}
