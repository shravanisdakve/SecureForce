import { Link } from 'react-router-dom'
import { ShieldCheck, Medal, Award, Users, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SITE } from '../config'
import aboutImg from '../assets/about.png'

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-black text-white">About {SITE.name}</h1>
        <p className="mt-4 text-lg text-night-100">
          We exist to make every event, home, and business in {SITE.city} feel safe.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Our Story</h2>
          <p className="mt-4 leading-relaxed text-night-100">
            Founded in {SITE.foundedYear}, {SITE.name} started with a single guard
            and a simple promise: send the right person, trained properly, and
            take full responsibility for the result.
          </p>
          <p className="mt-4 leading-relaxed text-night-100">
            Today we deploy {SITE.guardsCount}+ personnel across {SITE.clientsCount}+ sites in{" "}
            {SITE.city} — handling everything from wedding bouncers to corporate
            security and fire safety. Our retention rate is high because our
            guards are paid fairly, trained regularly, and treated like part of
            the family.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Police-verified, background-checked personnel',
              'Monthly supervision and reporting on every site',
              'Insurance coverage on all deployments',
            ].map((x) => (
              <li key={x} className="flex items-center gap-2.5 text-sm text-white">
                <CheckCircle2 size={18} className="shrink-0 text-brand" /> {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 overflow-hidden rounded-2xl border border-white/10">
            <img src={aboutImg} alt="Our security team in action" className="h-56 w-full object-cover" />
          </div>
          {[
            { icon: ShieldCheck, title: 'Verified Staff', text: '100% police-verified team' },
            { icon: Award, title: '12+ Years', text: 'Proven track record' },
            { icon: Users, title: '350+ Personnel', text: 'Ready for deployment' },
            { icon: Medal, title: 'Certified', text: 'Fire & first-aid trained' },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-night-800 p-6 text-center">
              <c.icon size={30} className="mx-auto text-brand" />
              <p className="mt-3 font-bold text-white">{c.title}</p>
              <p className="mt-1 text-xs text-night-200">{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-3xl border border-brand/30 bg-brand/10 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          Ready to work with a team you can trust?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-night-100">
          Get a free, no-obligation quote within 30 minutes of your inquiry.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-8 py-3.5 text-base font-bold text-night transition hover:bg-brand-dark"
        >
          Get a Free Quote <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}
