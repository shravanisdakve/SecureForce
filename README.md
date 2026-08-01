<div align="center">

# SecureForce — Security Services Website

**Professional security manpower** — security guards, bouncers, fire safety officers & housekeeping staff.

Trusted by **500+ clients** with **350+ trained personnel** deployed across the city. Get an instant quote, or reach us by call / WhatsApp.

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Support](#support)

---

## Features

- **Services showcase** — detailed cards for Bouncers, Security Guards, Fire Safety Personnel and Housekeeping staff, with ideal-use cases for each.
- **Instant estimate calculator** — visitors get a rough price in seconds based on service, headcount and duration.
- **Enquiry / booking form** — validated form that submits leads straight to the backend.
- **Call & WhatsApp shortcuts** — floating action buttons and a mobile call bar so customers can reach you in one tap.
- **Admin panel (`/admin`)** — password-protected dashboard with:
  - **Leads** — view enquiries, call/WhatsApp the lead, add notes, mark contacted, delete.
  - **Clients** — keep records of clients (add / edit / delete) with service & status dropdowns.
  - **Settings** — edit brand name, phone, email, WhatsApp, city, stats, services and testimonials; the whole site updates automatically (white-label ready).
- **Responsive, dark-themed UI** — built with Tailwind CSS, looks good on phones, tablets and desktops.
- **Production-ready backend** — Express API with MongoDB storage (file-based fallback for local dev).

## Tech Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Frontend  | React 19, Vite 8, Tailwind CSS 4, React Router 7  |
| Backend   | Node.js, Express 5                                |
| Database  | MongoDB (Mongoose 9) — falls back to a JSON file  |
| Deploy    | Render (Blueprint) — also Docker/Cloud Run ready  |

## Project Structure

```
secureforce/
├── client/                  # React website (Vite)
│   ├── public/              #   static assets (logo, favicon, icons)
│   ├── src/
│   │   ├── assets/          #   images used in pages
│   │   ├── components/      #   Navbar, Footer, LeadForm, EstimateCalculator, etc.
│   │   ├── pages/           #   Home, Services, About, Contact, Admin, NotFound
│   │   ├── config.js        #   default business details (fallback values)
│   │   ├── siteContext.jsx  #   loads /api/settings and exposes it to the app
│   │   ├── App.jsx          #   routes + app shell
│   │   └── main.jsx         #   entry point
│   ├── index.html
│   └── vite.config.js       #   dev proxy for /api -> localhost:3001
├── server/                  # Node/Express backend
│   ├── server.js            #   Express app + leads/clients/settings logic
│   ├── .env.example         #   template for env vars (never commit .env)
│   ├── data/                #   JSON fallback storage (git-ignored)
│   └── package.json
├── render.yaml              # Render blueprint (auto-deploy from GitHub)
├── Dockerfile               # optional production container image
├── deploy.sh                # optional one-command deploy to Cloud Run
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+ recommended)
- Optional: a [MongoDB](https://www.mongodb.com) database URI for persistent storage

### 1. Backend

```bash
cd server
npm install
npm start
```

The API runs at `http://localhost:3001`. By default leads are saved to `server/data/leads.json`.

To use MongoDB and set the admin password, create `server/.env` (see `server/.env.example`):

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/secureforce
ADMIN_PASSWORD=your-secret-password
```

> `server/.env` is git-ignored — never commit your database credentials or admin password.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The dev server proxies `/api` requests to the backend on port 3001.

### Production build

```bash
cd client
npm run build     # outputs static files to client/dist
```

The Express server automatically serves `client/dist` when it exists, so a single container runs both the website and the API.

## Admin Panel

Open `/admin` on the site and log in with `ADMIN_PASSWORD` (default `secureforce123` — **change it before going live**).

- **Leads** — every quote-form submission lands here. Call or WhatsApp the customer straight from the row, add follow-up notes, mark as contacted, or delete.
- **Clients** — keep a record of your clients. Add/edit/delete entries; Service and Status are dropdowns (status: active / inactive / closed).
- **Settings** — edit all site content: company name, phone, WhatsApp, email, hours, city, stats, services (title/description/icon/rate/ideal-for) and testimonials. Saving updates the public site automatically — no code changes needed.

## API Reference

Base URL: `http://localhost:3001` (or your deployed domain)

Admin endpoints require the `x-admin-password` header.

### Public

| Method | Endpoint          | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| GET    | `/api/health`     | Health check; reports which storage is active |
| GET    | `/api/settings`   | Current site settings (brand, services, testimonials) |
| POST   | `/api/leads`      | Create a new enquiry lead                     |

### Admin

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| GET    | `/api/admin/leads`        | List all leads (newest first)     |
| PATCH  | `/api/admin/leads/:id`    | Update lead status / notes        |
| DELETE | `/api/admin/leads/:id`    | Delete a lead                     |
| GET    | `/api/admin/clients`      | List client records               |
| POST   | `/api/admin/clients`      | Create a client record            |
| PATCH  | `/api/admin/clients/:id`  | Update a client record            |
| DELETE | `/api/admin/clients/:id`  | Delete a client record            |
| PUT    | `/api/admin/settings`     | Save site settings                |

### POST `/api/leads`

Request body:

```json
{
  "name": "Rahul Shah",
  "phone": "9876543210",
  "service": "Security Guards",
  "location": "Andheri, Mumbai",
  "date": "2026-08-10",
  "message": "Need 4 guards for a society event"
}
```

Only `name`, `phone`, `service` and `location` are required. Returns `201 Created` with the stored lead.

## Configuration

### Site content (white-labeling)

Default business details live in `client/src/config.js` (company name, tagline, city, phone, email, WhatsApp, stats, services, testimonials). These act as fallback values.

To change them without touching code, use **Admin → Settings**: saved values are stored in the database (or `server/data/settings.json`) and take priority over `config.js`.

### Environment variables

| Env var          | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `MONGODB_URI`    | Atlas connection string (leads/clients/settings storage)        |
| `ADMIN_PASSWORD` | Password for `/admin` (change from the default!)               |
| `SMTP_HOST`      | e.g. `smtp.gmail.com` — enables lead email notifications        |
| `SMTP_USER`      | Gmail address used to send notifications                       |
| `SMTP_PASS`      | Gmail App Password (not your normal password)                  |
| `LEAD_EMAIL_TO`  | Where notifications go (defaults to `SMTP_USER`)               |

## Deployment

### Render (live)

The repo includes `render.yaml`, so deploying is automatic: push to GitHub `main` and Render builds and serves the site. Set the env vars above (especially `ADMIN_PASSWORD` and `MONGODB_URI`) on the Render dashboard.

> Free tier sleeps after inactivity — the first visit after a pause can be slow. A paid tier or custom domain is recommended for a real business.

### Docker / Google Cloud Run (optional)

```bash
docker build -t secureforce .
docker run -p 8080:8080 -e MONGODB_URI="$MONGODB_URI" secureforce
```

## Support

- **Phone / WhatsApp:** [+91 91234 56789](tel:+919123456789)
- **Email:** [secureforce.contact@gmail.com](mailto:secureforce.contact@gmail.com)
- **Hours:** 24/7 helpline
