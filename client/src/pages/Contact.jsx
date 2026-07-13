import { Phone, MessageCircle, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { SITE, telLink, whatsappLink } from '../config'
import LeadForm from '../components/LeadForm'
import Faq from '../components/Faq'

export default function Contact() {
  const cards = [
    {
      icon: Phone,
      title: 'Call Us',
      line1: SITE.phone,
      line2: SITE.hours,
      href: telLink(),
      action: 'Call Now',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      line1: SITE.phone,
      line2: 'Fastest response',
      href: whatsappLink(),
      action: 'Chat Now',
      external: true,
    },
    {
      icon: Mail,
      title: 'Email',
      line1: SITE.email,
      line2: 'Replies within 2 hrs',
      href: `mailto:${SITE.email}`,
      action: 'Send Email',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-black text-white">Contact & Book a Service</h1>
        <p className="mt-4 text-lg text-night-100">
          Three ways to reach us — pick whatever is easiest. We respond within 30
          minutes during business hours.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.external ? '_blank' : undefined}
            rel={c.external ? 'noreferrer' : undefined}
            className="group rounded-2xl border border-white/10 bg-night-800 p-7 text-center transition hover:-translate-y-1 hover:border-brand/50"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <c.icon size={24} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-white">{c.title}</h2>
            <p className="mt-2 text-sm font-medium text-night-100">{c.line1}</p>
            <p className="text-xs text-night-200">{c.line2}</p>
            <span className="mt-4 inline-block text-sm font-bold text-brand group-hover:underline">
              {c.action}
            </span>
          </a>
        ))}
      </div>

      <div className="mt-16 grid gap-10 rounded-3xl border border-white/10 bg-night-800 p-7 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-bold text-white">Request a Quote</h2>
          <p className="mt-3 text-sm leading-relaxed text-night-100">
            Fill in the form and we'll confirm availability and send pricing to
            your phone. Prefer talking? Call us directly.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-night-100">
            <li className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />
              Free consultation — no charges until you approve.
            </li>
            <li className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-brand" />
              Call-back within 30 minutes (9am – 9pm).
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
              Serving all of {SITE.city} and nearby areas.
            </li>
          </ul>
        </div>
        <LeadForm />
      </div>

      <Faq />
    </div>
  )
}
