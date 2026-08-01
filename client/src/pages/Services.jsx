import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { SERVICES } from '../config'
import usePageTitle from '../hooks/usePageTitle'
import TiltCard from '../components/TiltCard'

export default function Services() {
  usePageTitle('Our Services')
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-black text-white">Our Services</h1>
        <p className="mt-4 text-lg text-night-100">
          Every service includes background-verified staff, supervision, and a
          dedicated contact person for your site.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {SERVICES.map((s, i) => (
          <TiltCard key={s.id} max={6}>
            <div className="grid gap-8 rounded-3xl border border-white/10 bg-night-800 p-8 md:grid-cols-[auto_1fr] md:p-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 text-3xl">
              {s.icon}
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-night-100">{s.description}</p>
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">Ideal for</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {s.uses.map((u) => (
                    <li
                      key={u}
                      className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-night-100"
                    >
                      <Check size={14} className="text-brand" /> {u}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/contact"
                className={`mt-7 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition ${
                  i % 2 === 0
                    ? 'bg-brand text-night hover:bg-brand-dark'
                    : 'border border-white/20 text-white hover:border-brand hover:text-brand'
                }`}
              >
                Request This Service <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          </TiltCard>
        ))}
      </div>
    </div>
  )
}
