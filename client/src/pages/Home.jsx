import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Phone, ShieldCheck, Clock, Users, Award, ArrowRight, Quote } from 'lucide-react'
import { SITE, SERVICES, TRUST_BADGES, TESTIMONIALS, telLink } from '../config'
import usePageTitle from '../hooks/usePageTitle'
import LeadForm from '../components/LeadForm'
import EstimateCalculator from '../components/EstimateCalculator'
import TiltCard from '../components/TiltCard'
import bookingImg from '../assets/booking-form.png'
import heroImg from '../assets/hero.jpg'

const Hero3D = lazy(() => import('../components/Hero3D'))

export default function Home() {
  usePageTitle('Security Guards & Bouncers in Mumbai')
  return (
    <div>
      <Hero />
      <TrustStrip />
      <ServicesPreview />
      <EstimateCalculator />
      <WhyUs />
      <Testimonials />
      <QuoteSection />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(250,204,21,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.12),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand">
            <ShieldCheck size={14} /> Trusted {SITE.tagline}
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Professional Security Services in <span className="text-brand">{SITE.city}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-night-100">
            Trained guards, bouncers, fire safety officers, and housekeeping
            staff — deployed within hours. {SITE.hours} response, background-verified
            personnel, and service you can actually trust.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={telLink()}
              className="flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-base font-bold text-night shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
            >
              <Phone size={20} strokeWidth={2.5} /> Call Now
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-lg border border-white/20 px-7 py-3.5 text-base font-bold text-white transition hover:border-brand hover:text-brand"
            >
              Get a Free Quote <ArrowRight size={18} />
            </Link>
          </div>
          <p className="mt-6 text-sm text-night-200">
            📞 {SITE.phone} · {SITE.hours}
          </p>
        </div>

        <div className="relative hidden lg:block">
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <img
              src={heroImg}
              alt={`${SITE.shortName} security personnel on duty`}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 h-44 w-44 xl:h-52 xl:w-52">
            <Suspense fallback={null}>
              <Hero3D />
            </Suspense>
          </div>
          <div className="absolute -left-6 top-10 rounded-2xl border border-white/10 bg-night-800/90 p-4 shadow-xl backdrop-blur">
            <p className="flex items-center gap-2 text-sm font-bold text-white"><Clock size={16} className="text-brand" /> 24/7 Deployment</p>
          </div>
          <div className="absolute -right-4 bottom-12 rounded-2xl border border-white/10 bg-night-800/90 p-4 shadow-xl backdrop-blur">
            <p className="flex items-center gap-2 text-sm font-bold text-white"><Users size={16} className="text-brand" /> {SITE.guardsCount}+ Guards</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  const icons = [Award, Users, Clock, ShieldCheck]
  return (
    <section className="border-y border-white/10 bg-night-800">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {TRUST_BADGES.map((b, i) => {
          const Icon = icons[i]
          return (
            <div key={b.label} className="flex items-center gap-3">
              <Icon size={26} className="shrink-0 text-brand" />
              <div>
                <p className="text-2xl font-black text-white">{b.value}</p>
                <p className="text-xs uppercase tracking-wider text-night-200">{b.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ServicesPreview() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-black text-white sm:text-4xl">Our Services</h2>
        <p className="mt-4 text-night-100">
          One team for all your security and staffing needs. Every deployment is
          verified, trained, and supervised.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <TiltCard key={s.id}>
            <Link
              to="/services"
              className="group block h-full rounded-2xl border border-white/10 bg-night-800 p-7 transition hover:-translate-y-1 hover:border-brand/50 hover:bg-night-700"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
                {s.icon}
              </span>
              <h3 className="mt-5 text-xl font-bold text-white group-hover:text-brand">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-night-100">{s.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                Request This Service <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}

function WhyUs() {
  const points = [
    {
      icon: ShieldCheck,
      title: 'Background-Verified Staff',
      text: 'Every guard is police-verified, trained, and insurance-covered before deployment.',
    },
    {
      icon: Clock,
      title: 'Deployed Within Hours',
      text: 'Need guards tonight? Our standby pool in ' + SITE.city + ' can deploy on short notice.',
    },
    {
      icon: Award,
      title: 'Years of Trust',
      text: 'Serving ' + SITE.clientsCount + '+ clients since ' + SITE.foundedYear + ' with zero major incidents.',
    },
    {
      icon: Users,
      title: 'Supervised & Accountable',
      text: 'Every site gets a supervisor and monthly reports, so you always know what you pay for.',
    },
  ]
  return (
    <section className="border-y border-white/10 bg-night-800">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black text-white sm:text-4xl">Why Businesses Trust Us</h2>
          <p className="mt-4 text-night-100">
            We don't just send manpower — we take responsibility for the outcome.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="flex gap-4 rounded-2xl border border-white/10 bg-night p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <p.icon size={22} />
              </span>
              <div>
                <h3 className="font-bold text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-night-100">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="text-3xl font-black text-white sm:text-4xl">What Clients Say</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <TiltCard key={t.name} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-night-800 p-7">
              <Quote size={26} className="text-brand" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-night-100">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-4">
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-xs uppercase tracking-wider text-brand">{t.role}</p>
              </figcaption>
            </figure>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}

function QuoteSection() {
  return (
    <section className="border-t border-white/10 bg-gradient-to-b from-night to-night-800">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Get Your Free Quote <span className="text-brand">Today</span>
          </h2>
          <p className="mt-4 leading-relaxed text-night-100">
            Tell us what you need and we'll call back within 30 minutes with
            availability and pricing. No obligation, no spam.
          </p>
          <ul className="mt-8 space-y-4">
            {['Instant availability check', 'Transparent, fixed pricing', 'Free on-site assessment in ' + SITE.city].map((x) => (
              <li key={x} className="flex items-center gap-3 text-sm font-medium text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-brand">✓</span>
                {x}
              </li>
            ))}
          </ul>
          <img
            src={bookingImg}
            alt="How booking a service works"
            className="mt-8 hidden max-h-72 rounded-xl border border-white/10 object-contain lg:block"
          />
        </div>
        <div className="rounded-3xl border border-white/10 bg-night-800 p-7 sm:p-9">
          <LeadForm compact />
        </div>
      </div>
    </section>
  )
}
