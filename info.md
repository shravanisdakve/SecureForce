# SecureForce — Production Readiness & Buyer Pack

> Internal notes for the owner. This is the status of the site and what must be done
> before handing it to a client (a security-services provider) as a paid deliverable.

## What the site is

- React + Vite frontend, Express backend, MongoDB (Atlas) for leads.
- Pages: Home, Services, About, Contact (+ lead form), Admin (`/admin`), 404.
- Deployed on Render (free tier): `https://secureforce-8hnp.onrender.com`.
- Lead flow: quote form → `POST /api/leads` → MongoDB → visible on `/admin`
  (password-protected) + optional email notification.
- All site content/config lives in `client/src/config.js` (name, tagline, city,
  phone, email, WhatsApp, stats, services, testimonials).

## What's already good

- Clean, dark/gold design; fully responsive & mobile-friendly.
- Lead form → Mongo + admin dashboard with call/WhatsApp/mark-contacted/delete.
- WhatsApp + call CTAs everywhere, floating buttons, mobile bottom bar.
- SEO meta tags + JSON-LD LocalBusiness, per-page titles.
- Custom gold-on-black logo (navbar, footer, favicon, share preview).
- 3D shield hero badge + tilt-card effects.

## Must fix before selling

1. **Fake content** — testimonials, stats (500+ clients, 350+ guards, founded 2012),
   address, and the brand name "SecureForce" are fabricated. Swap in the client's
   real details in `client/src/config.js`. Never ship fake testimonials.
2. **Admin password is the default** (`secureforce123`) — set a real `ADMIN_PASSWORD`
   env var on Render.
3. **No spam protection** — add rate limiting on the form and `/admin` login
   (e.g. `express-rate-limit`).
4. **Email notifications are off by default** — client must configure SMTP
   (Gmail App Password) or they'll only see leads in the admin page.
5. **Contact placeholders** — phone `+91 91234 56789`, email
   `secureforce.contact@gmail.com`, address are placeholders. Use the client's real ones.

## Nice-to-haves for a paid client

- Privacy policy + terms pages (required for Google Ads).
- Custom domain + Google Business Profile (free tier sleeps after inactivity → slow
  first visit; paid tier or custom domain recommended for a real business).
- Sitemap / robots.txt for SEO.

## White-labeling (what I'd change for a buyer)

"White-label" = resell the same software as the buyer's own brand. For this site it means:

- Brand name → buyer's name (config.js + README + index.html title/meta).
- Logo → buyer's logo (swap `client/src/assets/logo.png` + favicon/OG files).
- Brand color accent → optional (currently gold `#facc15`, change in
  `client/src/index.css` `@theme` if they want a different color).
- City, phone, email, WhatsApp, address → buyer's real details (config.js).
- Stats & testimonials → buyer's real numbers/reviews.
- Admin password + SMTP → buyer's credentials.
- Keep the domain/plan decision: their own custom domain on Render (or move host).

Everything is centralized in `config.js` / `index.css` / image assets, so the swap
is fast and low-risk.

## Buyer onboarding (env vars to set on Render)

| Env var | Purpose |
|---|---|
| `MONGODB_URI` | Atlas connection string (leads storage) |
| `ADMIN_PASSWORD` | Password for `/admin` (change from default!) |
| `SMTP_HOST` | `smtp.gmail.com` to enable email notifications |
| `SMTP_USER` | Gmail address used to send notifications |
| `SMTP_PASS` | Gmail App Password (not the normal password) |
| `LEAD_EMAIL_TO` | Where notifications go (defaults to SMTP_USER) |
