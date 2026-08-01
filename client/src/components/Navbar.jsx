import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useSite } from '../siteContext'
import logo from '../assets/logo.png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { site: SITE, telLink } = useSite()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt={`${SITE.shortName} logo`}
            className="h-9 w-auto rounded-md object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            {SITE.shortName}
            <span className="block text-[10px] font-medium uppercase tracking-widest text-brand">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-brand' : 'text-night-100 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={telLink()}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-night transition hover:bg-brand-dark"
          >
            <Phone size={16} strokeWidth={2.5} />
            Call Now
          </a>
        </nav>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-night-800 px-4 py-4 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 text-sm font-medium ${
                  isActive ? 'text-brand' : 'text-night-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={telLink()}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-night"
          >
            <Phone size={16} strokeWidth={2.5} />
            Call Now — {SITE.phone}
          </a>
        </nav>
      )}
    </header>
  )
}
