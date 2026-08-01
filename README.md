<div align="center">

# SecureForce — Security Services Website

**Professional security manpower for Mumbai** — security guards, bouncers, fire safety officers & housekeeping staff.

Trusted by **500+ clients** with **350+ trained personnel** deployed across the city. Get an instant quote, or reach us by call / WhatsApp.

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
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
- **Responsive, dark-themed UI** — built with Tailwind CSS, looks good on phones, tablets and desktops.
- **Production-ready backend** — Express API with MongoDB storage (file-based fallback for local dev).

## Tech Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Frontend  | React 19, Vite 8, Tailwind CSS 4, React Router 7  |
| Backend   | Node.js, Express 5                                |
| Database  | MongoDB (Mongoose 9) — falls back to a JSON file  |
| Deploy    | Docker, Google Cloud Run                          |

## Project Structure

```
secureforce/
├── client/                  # React website (Vite)
│   ├── public/              #   static assets (logo, favicon, icons)
│   ├── src/
│   │   ├── assets/          #   images used in pages
│   │   ├── components/      #   Navbar, Footer, LeadForm, EstimateCalculator, etc.
│   │   ├── pages/           #   Home, Services, About, Contact, NotFound
│   │   ├── config.js        #   ALL business details in one place
│   │   ├── App.jsx          #   routes + app shell
│   │   └── main.jsx         #   entry point
│   ├── index.html
│   └── vite.config.js       #   dev proxy for /api -> localhost:3001
├── server/                  # Node/Express backend
│   ├── server.js            #   Express app + lead storage logic
│   ├── .env.example         #   template for env vars (never commit .env)
│   └── package.json
├── Dockerfile               # production container image
├── deploy.sh                # one-command deploy to Cloud Run
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+ recommended)
- Optional: a [MongoDB](https://www.mongodb.com) database URI for persistent lead storage

### 1. Backend

```bash
cd server
npm install
npm start
```

The API runs at `http://localhost:3001`. By default leads are saved to `server/data/leads.json`.

To use MongoDB instead, create `server/.env`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/secureforce
```

> `server/.env` is git-ignored — never commit your database credentials.

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

## API Reference

Base URL: `http://localhost:3001` (or your deployed domain)

| Method | Endpoint      | Description                                  |
| ------ | ------------- | -------------------------------------------- |
| GET    | `/api/health` | Health check; reports which storage is active |
| GET    | `/api/leads`  | List all enquiry leads (newest first)         |
| POST   | `/api/leads`  | Create a new enquiry lead                     |

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

All business details — company name, phone, WhatsApp number, email, address, services and pricing — live in **one file**:

```
client/src/config.js
```

Edit the `SITE` and `SERVICES` exports there and the whole website updates automatically.

## Deployment

### Docker

```bash
docker build -t secureforce .
docker run -p 8080:8080 -e MONGODB_URI="$MONGODB_URI" secureforce
```

### Google Cloud Run

```bash
./deploy.sh <your-google-cloud-project-id>
```

The script builds the client, builds the container image, and deploys it to Cloud Run in `asia-south1`.

## Support

- **Phone / WhatsApp:** [+91 90823 87406](tel:+919082387406)
- **Email:** [shravanisdakve@gmail.com](mailto:shravanisdakve@gmail.com)
- **Hours:** 24/7 helpline
