import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'How fast can you deploy security staff?',
    a: 'For standard requests we deploy within 24–48 hours. For urgent needs — events or last-minute requirements — our standby pool in Mumbai can be on-site within hours.',
  },
  {
    q: 'How is the pricing calculated?',
    a: 'Pricing depends on the service, number of personnel, shift length, and site risk. Use the instant estimate on our homepage for a rough figure — final pricing is confirmed after a quick free site visit.',
  },
  {
    q: 'Are your guards background-verified?',
    a: 'Yes. Every deployment is police-verified, trained, and insured before staff start, and every site gets regular supervision and reporting.',
  },
  {
    q: 'Which areas do you serve?',
    a: 'We operate across Mumbai and the surrounding areas. If you are outside the city, call us and we will see if we can arrange coverage for you.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-black text-white sm:text-4xl">Frequently Asked Questions</h2>
        <p className="mt-4 text-night-100">
          Quick answers to the questions we get asked most.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <div
              key={f.q}
              className={`overflow-hidden rounded-2xl border bg-night-800 transition ${
                isOpen ? 'border-brand/40' : 'border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-bold text-white">{f.q}</span>
                <ChevronDown
                  size={20}
                  strokeWidth={2.5}
                  className={`shrink-0 text-brand transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <p className="border-t border-white/10 px-6 py-5 text-sm leading-relaxed text-night-100">
                  {f.a}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
