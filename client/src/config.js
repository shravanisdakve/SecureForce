export const SITE = {
  name: "SecureForce Security Services",
  shortName: "SecureForce",
  tagline: "Professional Security Services",
  city: "Mumbai",
  phone: "+91 90823 87406",
  phoneHref: "+919082387406",
  whatsappNumber: "919082387406",
  whatsappMessage: "Hi, I want to inquire about your security services.",
  email: "shravanisdakve@gmail.com",
  address: "123, Main Road, [Your City]",
  hours: "24/7 Helpline",
  foundedYear: 2012,
  clientsCount: 500,
  guardsCount: 350,
  yearsExperience: 12,
}

export const SERVICES = [
  {
    id: "bouncers",
    icon: "🚧",
    title: "Bouncers & Door Supervisors",
    description:
      "Trained bouncers for events, clubs, pubs, and night parties who handle crowd control and gate management professionally.",
    uses: ["Weddings & private parties", "Clubs & pubs", "Concerts & festivals"],
    rate: 200,
  },
  {
    id: "security-guards",
    icon: "🛡️",
    title: "Security Guards",
    description:
      "Reliable guards for residential societies, commercial buildings, shops, and corporate offices with round-the-clock deployment.",
    uses: ["Residential societies", "Corporate offices", "Retail & showrooms"],
    rate: 120,
  },
  {
    id: "fire-safety",
    icon: "🧯",
    title: "Fire Safety Personnel",
    description:
      "Certified fire safety officers for buildings and events who manage evacuation, prevention, and emergency response.",
    uses: ["Factories & warehouses", "Events & venues", "Commercial buildings"],
    rate: 150,
  },
  {
    id: "housekeeping",
    icon: "🧹",
    title: "Housekeeping Staff",
    description:
      "Trained housekeeping personnel for offices, hotels, and institutions ensuring clean, hygienic, and well-maintained premises.",
    uses: ["Offices & coworking spaces", "Hotels & lodges", "Hospitals & clinics"],
    rate: 100,
  },
]

export const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Event Organizer",
    quote:
      "Their bouncers handled a 2,000-person wedding flawlessly. Very professional and well-trained team.",
  },
  {
    name: "Priya Sharma",
    role: "Society Secretary",
    quote:
      "We've had SecureForce guards for 3 years. Response time and discipline are the best we've seen.",
  },
  {
    name: "Amit Verma",
    role: "Retail Chain Owner",
    quote:
      "The fire safety team they deployed passed all our compliance audits. Highly recommended.",
  },
]

export const TRUST_BADGES = [
  { value: "12+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "350+", label: "Trained Guards" },
  { value: "24/7", label: "Support" },
]

export function whatsappLink(message = SITE.whatsappMessage) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function telLink() {
  return `tel:${SITE.phoneHref}`
}
