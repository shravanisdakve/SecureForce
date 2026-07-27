import { Link } from 'react-router-dom'
import { ShieldOff, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <ShieldOff size={72} className="text-brand" strokeWidth={1.3} />
      <h1 className="mt-6 text-5xl font-black text-white">404</h1>
      <p className="mt-3 max-w-md text-night-100">
        This page doesn't exist — but your safety is still guaranteed.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-base font-bold text-night transition hover:bg-brand-dark"
      >
        <Home size={18} /> Back to Home
      </Link>
    </div>
  )
}
