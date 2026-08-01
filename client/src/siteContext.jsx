/* oxlint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { SITE, SERVICES, TESTIMONIALS } from './config'

const SiteContext = createContext(null)

function setMeta(selector, value) {
  const el = document.querySelector(selector)
  if (el) el.content = value
}

function applyMeta(site) {
  setMeta('meta[name="description"]', `Professional security guards, bouncers, fire safety personnel, and housekeeping staff in ${site.city}. Call ${site.phone}.`)
  setMeta('meta[property="og:title"]', `${site.shortName} — ${site.city}`)
  setMeta('meta[property="og:description"]', `Trusted security guards, bouncers, fire safety personnel, and housekeeping staff in ${site.city}. 24/7 deployment. Call ${site.phone}.`)
  setMeta('meta[name="twitter:title"]', `${site.shortName} — ${site.city}`)
  setMeta('meta[name="twitter:description"]', `Trusted security guards, bouncers, fire safety personnel, and housekeeping staff in ${site.city}. Call ${site.phone}.`)
  const ld = document.querySelector('script[type="application/ld+json"]')
  if (ld) {
    try {
      const data = JSON.parse(ld.textContent)
      data.name = site.name
      data.description = `Professional security guards, bouncers, fire safety personnel and housekeeping staff in ${site.city}.`
      data.telephone = site.phone
      data.email = site.email
      if (data.address) data.address.addressLocality = site.city
      ld.textContent = JSON.stringify(data)
    } catch {
      /* keep original schema */
    }
  }
}

export function SiteProvider({ children }) {
  const [site, setSite] = useState({ ...SITE })
  const [services, setServices] = useState(SERVICES)
  const [testimonials, setTestimonials] = useState(TESTIMONIALS)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        const nextSite = { ...SITE, ...(d.site || {}) }
        setSite(nextSite)
        if (Array.isArray(d.services) && d.services.length) setServices(d.services)
        if (Array.isArray(d.testimonials) && d.testimonials.length) setTestimonials(d.testimonials)
        applyMeta(nextSite)
      })
      .catch(() => {})
  }, [])

  const phoneHref = site.phoneHref || '+' + site.phone.replace(/\D/g, '')
  const whatsappNumber = site.whatsappNumber || phoneHref.replace('+', '')
  const telLink = () => `tel:${phoneHref}`
  const whatsappLink = (message = '') =>
    `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`

  return (
    <SiteContext.Provider value={{ site, services, testimonials, telLink, whatsappLink }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
