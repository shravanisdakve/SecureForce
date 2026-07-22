import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, ArrowRight } from 'lucide-react'
import { SERVICES } from '../config'

const SHIFTS = [
  { value: 4, label: '4 hrs (event)' },
  { value: 8, label: '8 hrs (day)' },
  { value: 12, label: '12 hrs' },
  { value: 24, label: '24 hrs' },
]

const DAYS = [
  { value: 1, label: 'One day' },
  { value: 7, label: 'Weekly' },
  { value: 30, label: 'Monthly' },
]

export default function EstimateCalculator() {
  const [serviceId, setServiceId] = useState(SERVICES[1].id)
  const [guards, setGuards] = useState(4)
  const [hours, setHours] = useState(8)
  const [days, setDays] = useState(1)

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) || SERVICES[1],
    [serviceId],
  )

  const total = guards * hours * days * service.rate
  const perMonth = guards * hours * 30 * service.rate

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

  const inputCls =
    'w-full rounded-lg border border-white/15 bg-night-800 px-4 py-3 text-sm text-white outline-none transition focus:border-brand'

  return (
    <section className="border-t border-white/10 bg-night-800">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand">
            <Calculator size={14} /> Instant Estimate
          </span>
          <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
            Get a rough price <span className="text-brand">in seconds</span>
          </h2>
          <p className="mt-4 leading-relaxed text-night-100">
            No waiting for a call just to find out the ballpark. Adjust the
            numbers below and see an instant estimate. Final pricing is
            confirmed after a quick free site visit.
          </p>
          <div className="mt-8 rounded-2xl border border-brand/30 bg-brand/10 p-6">
            <p className="text-xs uppercase tracking-wider text-night-100">Your estimate</p>
            <p className="mt-1 text-4xl font-black text-brand">{fmt(total)}</p>
            <p className="mt-1 text-sm text-night-100">
              {guards} × {service.title.toLowerCase()} · {hours} hrs
              {days > 1 ? ` · ${days} days` : ' · single event'}
            </p>
            {days > 1 && (
              <p className="mt-2 text-sm text-night-200">
                ≈ {fmt(perMonth)} per month if deployed continuously
              </p>
            )}
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-bold text-night transition hover:bg-brand-dark"
            >
              Get Exact Quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="space-y-5 rounded-3xl border border-white/10 bg-night p-7 sm:p-9">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
              Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className={inputCls}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-night-100">
                Number of personnel
              </label>
              <span className="text-sm font-bold text-brand">{guards}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={guards}
              onChange={(e) => setGuards(Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
              Shift length
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SHIFTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setHours(s.value)}
                  className={`rounded-lg border px-2 py-2.5 text-xs font-bold transition ${
                    hours === s.value
                      ? 'border-brand bg-brand text-night'
                      : 'border-white/15 text-night-100 hover:border-brand/50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDays(d.value)}
                  className={`rounded-lg border px-2 py-2.5 text-xs font-bold transition ${
                    days === d.value
                      ? 'border-brand bg-brand text-night'
                      : 'border-white/15 text-night-100 hover:border-brand/50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-night-200">
            Rates are indicative ({fmt(service.rate)}/hr per personnel). Final
            quote depends on site, risk level, and requirements.
          </p>
        </div>
      </div>
    </section>
  )
}
