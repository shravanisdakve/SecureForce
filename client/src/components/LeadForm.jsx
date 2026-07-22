import { useState } from 'react'
import { CheckCircle2, Send, Loader2 } from 'lucide-react'
import { SERVICES, whatsappLink } from '../config'

const emptyForm = {
  name: '',
  phone: '',
  service: '',
  location: '',
  date: '',
  message: '',
}

export default function LeadForm({ compact = false }) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-brand/40 bg-brand/10 p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-brand" />
        <h3 className="mt-4 text-xl font-bold text-white">Request Received!</h3>
        <p className="mt-2 text-sm text-night-100">
          We'll call you back shortly. Want an instant reply?
        </p>
        <a
          href={whatsappLink(
            `Hi, I'm ${form.name || 'a customer'} and just submitted a request for ${form.service || 'security services'}.`,
          )}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-bold text-white"
        >
          Chat on WhatsApp
        </a>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-lg border border-white/15 bg-night-800 px-4 py-3 text-sm text-white placeholder-night-200 outline-none transition focus:border-brand'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4'}>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
            Name *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Your full name"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
            Phone *
          </label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="Your phone number"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
            Service needed *
          </label>
          <select
            required
            value={form.service}
            onChange={(e) => update('service', e.target.value)}
            className={inputCls}
          >
            <option value="" disabled>Select a service</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.title}>{s.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
            Location *
          </label>
          <input
            required
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="Event / property location"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className={`${inputCls} [color-scheme:dark]`}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-night-100">
            Number of guards (optional)
          </label>
          <input
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="e.g. 4 guards, 6 hours"
            className={inputCls}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-base font-bold text-night transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'submitting' ? (
          <><Loader2 size={18} className="animate-spin" /> Submitting...</>
        ) : (
          <><Send size={18} /> Get Free Quote</>
        )}
      </button>

      {status === 'error' && (
        <p className="text-center text-sm text-red-400">
          Something went wrong. Please try again or call us directly.
        </p>
      )}
    </form>
  )
}
