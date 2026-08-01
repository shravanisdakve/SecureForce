import { useCallback, useEffect, useState } from 'react'
import { Shield, Lock, LogOut, RefreshCw, Trash2, Phone, CheckCheck } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const PW_KEY = 'sf_admin_pw'

function leadId(l) {
  return l._id || l.id
}

export default function Admin() {
  usePageTitle('Admin — Leads')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(PW_KEY) != null)
  const [error, setError] = useState('')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'x-admin-password': sessionStorage.getItem(PW_KEY) || '' },
      })
      if (res.status === 401) {
        setAuthed(false)
        sessionStorage.removeItem(PW_KEY)
        return
      }
      if (!res.ok) throw new Error('failed')
      setLeads(await res.json())
    } catch {
      setError('Could not load leads. Try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchLeads()
  }, [authed, fetchLeads])

  async function login(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/leads', {
      headers: { 'x-admin-password': password },
    })
    if (res.status === 401) {
      setError('Wrong password.')
      return
    }
    if (res.ok) {
      sessionStorage.setItem(PW_KEY, password)
      setAuthed(true)
    } else {
      setError('Something went wrong. Try again.')
    }
  }

  async function updateStatus(lead, status) {
    const res = await fetch(`/api/admin/leads/${leadId(lead)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': sessionStorage.getItem(PW_KEY) || '',
      },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setLeads((ls) => ls.map((l) => (leadId(l) === leadId(lead) ? { ...l, status } : l)))
    }
  }

  async function remove(lead) {
    if (!window.confirm(`Delete the lead from ${lead.name}?`)) return
    const res = await fetch(`/api/admin/leads/${leadId(lead)}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': sessionStorage.getItem(PW_KEY) || '' },
    })
    if (res.ok) {
      setLeads((ls) => ls.filter((l) => leadId(l) !== leadId(lead)))
    }
  }

  function logout() {
    sessionStorage.removeItem(PW_KEY)
    setAuthed(false)
    setLeads([])
  }

  if (!authed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 sm:px-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 text-brand">
          <Lock size={28} />
        </span>
        <h1 className="mt-6 text-3xl font-black text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-night-200">Enter the admin password to view leads.</p>
        <form onSubmit={login} className="mt-8 w-full space-y-4">
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-lg border border-white/15 bg-night-800 px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-base font-bold text-night transition hover:bg-brand-dark"
          >
            <Lock size={18} /> Login
          </button>
        </form>
      </div>
    )
  }

  const unread = leads.filter((l) => l.status === 'new').length

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black text-white">
            <Shield size={26} className="text-brand" /> Leads
          </h1>
          <p className="mt-1 text-sm text-night-200">
            {leads.length} total · {unread} new
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:border-brand hover:text-brand"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:border-brand hover:text-brand"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      {loading && <p className="mt-10 text-center text-night-200">Loading…</p>}

      {!loading && !error && leads.length === 0 && (
        <p className="mt-10 rounded-2xl border border-white/10 bg-night-800 p-8 text-center text-night-100">
          No leads yet. When someone submits the quote form, it shows up here.
        </p>
      )}

      <div className="mt-8 space-y-4">
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
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`tel:${l.phone}`}
                className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-night transition hover:bg-brand-dark"
              >
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
                <button
                  onClick={() => updateStatus(l, 'contacted')}
                  className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs font-bold text-white transition hover:border-brand hover:text-brand"
                >
                  <CheckCheck size={14} /> Mark contacted
                </button>
              )}
              <button
                onClick={() => remove(l)}
                className="flex items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2 text-xs font-bold text-red-400 transition hover:border-red-400"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
