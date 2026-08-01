import { useCallback, useEffect, useState } from 'react'
import {
  Shield,
  Lock,
  LogOut,
  RefreshCw,
  Trash2,
  Phone,
  CheckCheck,
  Plus,
  Save,
  UserPlus,
  Users,
  Settings as SettingsIcon,
  X,
  Pencil,
  MessagesSquare,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const PW_KEY = 'sf_admin_pw'

function leadId(l) {
  return l._id || l.id
}

const inputCls =
  'w-full rounded-lg border border-white/15 bg-night-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-brand'
const btnPrimary =
  'flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-night transition hover:bg-brand-dark'
const btnGhost =
  'flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:border-brand hover:text-brand'
const btnDanger =
  'flex items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2 text-xs font-bold text-red-400 transition hover:border-red-400'

function Field({ label, value, onChange, type = 'text', textarea, placeholder, className }) {
  return (
    <label className={`block ${className || ''}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-night-200">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          className={inputCls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={inputCls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        />
      )}
    </label>
  )
}

function authHeaders() {
  return { 'x-admin-password': sessionStorage.getItem(PW_KEY) || '' }
}

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/leads', { headers: { 'x-admin-password': password } })
    if (res.status === 401) {
      setError('Wrong password.')
      return
    }
    if (res.ok) {
      sessionStorage.setItem(PW_KEY, password)
      onLogin()
    } else {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 sm:px-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 text-brand">
        <Lock size={28} />
      </span>
      <h1 className="mt-6 text-3xl font-black text-white">Admin Login</h1>
      <p className="mt-2 text-sm text-night-200">Enter the admin password to manage your site.</p>
      <form onSubmit={submit} className="mt-8 w-full space-y-4">
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className={inputCls}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" className={btnPrimary + ' w-full py-3.5 text-base'}>
          <Lock size={18} /> Login
        </button>
      </form>
    </div>
  )
}

function LeadsTab() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState({})

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/leads', { headers: authHeaders() })
      if (!res.ok) throw new Error('failed')
      setLeads(await res.json())
    } catch {
      setError('Could not load leads. Try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  async function updateStatus(lead, status) {
    const res = await fetch(`/api/admin/leads/${leadId(lead)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setLeads((ls) => ls.map((l) => (leadId(l) === leadId(lead) ? { ...l, status } : l)))
  }

  async function saveNotes(lead) {
    const value = notes[leadId(lead)] || ''
    const res = await fetch(`/api/admin/leads/${leadId(lead)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ notes: value }),
    })
    if (res.ok) setLeads((ls) => ls.map((l) => (leadId(l) === leadId(lead) ? { ...l, notes: value } : l)))
  }

  async function remove(lead) {
    if (!window.confirm(`Delete the lead from ${lead.name}?`)) return
    const res = await fetch(`/api/admin/leads/${leadId(lead)}`, { method: 'DELETE', headers: authHeaders() })
    if (res.ok) setLeads((ls) => ls.filter((l) => leadId(l) !== leadId(lead)))
  }

  const unread = leads.filter((l) => l.status === 'new').length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-night-200">
          {leads.length} total · {unread} new
        </p>
        <button onClick={fetchLeads} className={btnGhost}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      {loading && <p className="mt-10 text-center text-night-200">Loading…</p>}

      {!loading && !error && leads.length === 0 && (
        <p className="mt-6 rounded-2xl border border-white/10 bg-night-800 p-8 text-center text-night-100">
          No leads yet. When someone submits the quote form, it shows up here.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {leads.map((l) => (
          <div
            key={leadId(l)}
            className={`rounded-2xl border bg-night-800 p-6 ${
              l.status === 'new' ? 'border-brand/40' : 'border-white/10 opacity-80'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">{l.name}</h3>
                <p className="text-sm text-night-200">
                  {l.createdAt ? new Date(l.createdAt).toLocaleString() : ''}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  l.status === 'new' ? 'bg-brand/20 text-brand' : 'bg-white/10 text-night-200'
                }`}
              >
                {l.status}
              </span>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-night-100 sm:grid-cols-2">
              <p><span className="text-night-200">Service:</span> {l.service}</p>
              <p><span className="text-night-200">Location:</span> {l.location}</p>
              {l.date && <p><span className="text-night-200">Date:</span> {l.date}</p>}
              {l.message && <p><span className="text-night-200">Details:</span> {l.message}</p>}
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-night-200">Notes</p>
              <textarea
                rows={2}
                className={inputCls + ' mt-1'}
                placeholder="Call notes, follow-up reminders…"
                value={notes[leadId(l)] ?? l.notes ?? ''}
                onChange={(e) => setNotes((n) => ({ ...n, [leadId(l)]: e.target.value }))}
              />
              <button onClick={() => saveNotes(l)} className={btnGhost + ' mt-2'}>
                <Save size={14} /> Save notes
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${l.phone}`} className={btnPrimary}>
                <Phone size={14} /> Call {l.phone}
              </a>
              <a
                href={`https://wa.me/${String(l.phone).replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-600"
              >
                WhatsApp
              </a>
              {l.status === 'new' && (
                <button onClick={() => updateStatus(l, 'contacted')} className={btnGhost}>
                  <CheckCheck size={14} /> Mark contacted
                </button>
              )}
              <button onClick={() => remove(l)} className={btnDanger}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const emptyClient = {
  name: '',
  phone: '',
  email: '',
  company: '',
  location: '',
  service: '',
  notes: '',
  status: 'active',
}

function ClientsTab() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [draft, setDraft] = useState(emptyClient)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState(emptyClient)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/clients', { headers: authHeaders() })
      if (!res.ok) throw new Error('failed')
      setClients(await res.json())
    } catch {
      setError('Could not load clients. Try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const setField = (setter, field, value) => setter((d) => ({ ...d, [field]: value }))

  async function addClient(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(draft),
    })
    if (!res.ok) {
      setError('Could not save client.')
      return
    }
    const created = await res.json()
    setClients((cs) => [created, ...cs])
    setDraft(emptyClient)
    setShowAdd(false)
  }

  async function saveEdit(e) {
    e.preventDefault()
    setError('')
    const res = await fetch(`/api/admin/clients/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(editDraft),
    })
    if (!res.ok) {
      setError('Could not update client.')
      return
    }
    setClients((cs) => cs.map((c) => (c._id === editingId || c.id === editingId ? { ...c, ...editDraft } : c)))
    setEditingId(null)
  }

  async function removeClient(c) {
    if (!window.confirm(`Remove client ${c.name}?`)) return
    const id = c._id || c.id
    const res = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (res.ok) setClients((cs) => cs.filter((x) => (x._id || x.id) !== id))
  }

  function clientFields(value, setter) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" value={value.name} onChange={(v) => setField(setter, 'name', v)} required />
        <Field label="Phone" value={value.phone} onChange={(v) => setField(setter, 'phone', v)} required />
        <Field label="Company" value={value.company} onChange={(v) => setField(setter, 'company', v)} />
        <Field label="Email" value={value.email} type="email" onChange={(v) => setField(setter, 'email', v)} />
        <Field label="Location" value={value.location} onChange={(v) => setField(setter, 'location', v)} />
        <Field label="Service" value={value.service} onChange={(v) => setField(setter, 'service', v)} />
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-night-200">Status</span>
          <select
            className={inputCls}
            value={value.status}
            onChange={(e) => setField(setter, 'status', e.target.value)}
          >
            {['active', 'inactive', 'closed'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <Field label="Notes" value={value.notes} textarea onChange={(v) => setField(setter, 'notes', v)} className="sm:col-span-2" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-night-200">{clients.length} records</p>
        <div className="flex gap-2">
          <button onClick={fetchClients} className={btnGhost}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button onClick={() => setShowAdd((s) => !s)} className={btnPrimary}>
            <UserPlus size={15} /> Add client
          </button>
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      {loading && <p className="mt-10 text-center text-night-200">Loading…</p>}

      {showAdd && (
        <form onSubmit={addClient} className="mt-6 rounded-2xl border border-brand/30 bg-night-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-white">New client</h3>
            <button type="button" onClick={() => setShowAdd(false)} className={btnGhost}>
              <X size={14} /> Cancel
            </button>
          </div>
          {clientFields(draft, setDraft)}
          <button type="submit" className={btnPrimary + ' mt-4'}>
            <Plus size={15} /> Add client
          </button>
        </form>
      )}

      {!loading && clients.length === 0 && (
        <p className="mt-6 rounded-2xl border border-white/10 bg-night-800 p-8 text-center text-night-100">
          No client records yet. Add your first client to start tracking deployments.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {clients.map((c) => {
          const id = c._id || c.id
          return (
            <div key={id} className="rounded-2xl border border-white/10 bg-night-800 p-5">
              {editingId === id ? (
                <form onSubmit={saveEdit}>
                  {clientFields(editDraft, setEditDraft)}
                  <div className="mt-4 flex gap-2">
                    <button type="submit" className={btnPrimary}>
                      <Save size={15} /> Save
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className={btnGhost}>
                      <X size={15} /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">{c.name}</h3>
                      <p className="text-sm text-night-200">
                        {[c.company, c.location, c.service].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        c.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-night-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  {(c.phone || c.email) && (
                    <p className="mt-2 text-sm text-night-100">
                      {c.phone && <a href={`tel:${c.phone}`} className="hover:text-brand">{c.phone}</a>}
                      {c.phone && c.email && ' · '}
                      {c.email && <a href={`mailto:${c.email}`} className="hover:text-brand">{c.email}</a>}
                    </p>
                  )}
                  {c.notes && <p className="mt-2 text-sm italic text-night-200">{c.notes}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(id)
                        setEditDraft({ ...c })
                      }}
                      className={btnGhost}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => removeClient(c)} className={btnDanger}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const siteFields = [
  ['name', 'Company name'],
  ['shortName', 'Short name'],
  ['tagline', 'Tagline'],
  ['heroBlurb', 'Hero blurb'],
  ['city', 'City'],
  ['phone', 'Phone'],
  ['phoneHref', 'Phone link (tel: value)'],
  ['whatsappNumber', 'WhatsApp number'],
  ['email', 'Email'],
  ['hours', 'Working hours'],
  ['foundedYear', 'Founded year'],
  ['yearsExperience', 'Years experience'],
  ['clientsCount', 'Clients count'],
  ['guardsCount', 'Guards count'],
]

const emptyService = { id: '', title: '', description: '', icon: '🛡️', rate: 200, uses: [] }

function SettingsTab() {
  const [site, setSite] = useState({})
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('failed')
      const d = await res.json()
      setSite(d.site || {})
      setServices((d.services || []).map((s) => ({ ...s, usesStr: (s.uses || []).join(', ') })))
      setTestimonials(d.testimonials || [])
    } catch {
      setError('Could not load settings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const setSiteField = (field, value) => setSite((s) => ({ ...s, [field]: value }))

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    setError('')
    const body = {
      site,
      services: services.map((s) => ({
        id: s.id || `svc-${Math.random().toString(36).slice(2, 7)}`,
        title: s.title,
        description: s.description,
        icon: s.icon || '🛡️',
        rate: Number(s.rate) || 200,
        uses: (s.usesStr || '').split(',').map((x) => x.trim()).filter(Boolean),
      })),
      testimonials,
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('failed')
      setMsg('Settings saved. Public pages update after the next page load.')
    } catch {
      setError('Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  function updateService(i, field, value) {
    setServices((ss) => ss.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))
  }

  function updateTestimonial(i, field, value) {
    setTestimonials((ts) => ts.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))
  }

  if (loading) return <p className="mt-10 text-center text-night-200">Loading…</p>

  return (
    <form onSubmit={save} className="space-y-8">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {msg && <p className="text-sm text-green-400">{msg}</p>}

      <section className="rounded-2xl border border-white/10 bg-night-800 p-6">
        <h3 className="mb-4 font-bold text-white">Brand & contact details</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {siteFields.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={site[key] ?? ''}
              textarea={key === 'heroBlurb'}
              onChange={(v) => setSiteField(key, v)}
              className={key === 'heroBlurb' ? 'sm:col-span-2' : undefined}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-night-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-white">Services ({services.length})</h3>
          <button
            type="button"
            onClick={() =>
              setServices((ss) => [
                ...ss,
                { ...emptyService, id: `svc-${Math.random().toString(36).slice(2, 7)}`, title: '', description: '', usesStr: '' },
              ])
            }
            className={btnGhost}
          >
            <Plus size={15} /> Add service
          </button>
        </div>
        {services.length === 0 && (
          <p className="text-sm text-night-200">No services yet. Add one to show it on the site.</p>
        )}
        <div className="space-y-4">
          {services.map((s, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-night p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title" value={s.title} onChange={(v) => updateService(i, 'title', v)} />
                <Field label="Icon (emoji)" value={s.icon} onChange={(v) => updateService(i, 'icon', v)} />
                <Field
                  label="Description"
                  value={s.description}
                  textarea
                  onChange={(v) => updateService(i, 'description', v)}
                  className="sm:col-span-2"
                />
                <Field
                  label="Rate (₹/hr per personnel)"
                  type="number"
                  value={s.rate}
                  onChange={(v) => updateService(i, 'rate', v)}
                />
                <Field
                  label="Ideal for (comma separated)"
                  value={s.usesStr}
                  onChange={(v) => updateService(i, 'usesStr', v)}
                />
              </div>
              <button type="button" onClick={() => setServices((ss) => ss.filter((_, idx) => idx !== i))} className={btnDanger + ' mt-3'}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-night-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-white">Testimonials ({testimonials.length})</h3>
          <button
            type="button"
            onClick={() => setTestimonials((ts) => [...ts, { name: '', role: '', quote: '' }])}
            className={btnGhost}
          >
            <Plus size={15} /> Add testimonial
          </button>
        </div>
        {testimonials.length === 0 && (
          <p className="text-sm text-night-200">No testimonials yet. Add one to show it on the homepage.</p>
        )}
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-night p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name" value={t.name} onChange={(v) => updateTestimonial(i, 'name', v)} />
                <Field label="Role" value={t.role} onChange={(v) => updateTestimonial(i, 'role', v)} />
                <Field
                  label="Quote"
                  value={t.quote}
                  textarea
                  onChange={(v) => updateTestimonial(i, 'quote', v)}
                  className="sm:col-span-2"
                />
              </div>
              <button
                type="button"
                onClick={() => setTestimonials((ts) => ts.filter((_, idx) => idx !== i))}
                className={btnDanger + ' mt-3'}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button type="submit" disabled={saving} className={btnPrimary + ' px-8 py-3 shadow-lg shadow-brand/20'}>
          <Save size={16} /> {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}

const TABS = [
  { id: 'leads', label: 'Leads', icon: MessagesSquare },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function Admin() {
  usePageTitle('Admin')
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(PW_KEY) != null)
  const [tab, setTab] = useState('leads')

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  function logout() {
    sessionStorage.removeItem(PW_KEY)
    setAuthed(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-3xl font-black text-white">
          <Shield size={26} className="text-brand" /> Admin
        </h1>
        <button onClick={logout} className={btnGhost}>
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-white/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
              tab === t.id ? 'bg-brand text-night' : 'text-night-100 hover:text-brand'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'leads' && <LeadsTab />}
        {tab === 'clients' && <ClientsTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}
