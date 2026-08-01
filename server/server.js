import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import { existsSync } from 'node:fs'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const LEADS_FILE = join(DATA_DIR, 'leads.json')
const CLIENTS_FILE = join(DATA_DIR, 'clients.json')
const SETTINGS_FILE = join(DATA_DIR, 'settings.json')
const CLIENT_DIST = join(__dirname, '..', 'client', 'dist')

const MONGODB_URI = process.env.MONGODB_URI
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secureforce123'
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO || SMTP_USER

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  location: { type: String, required: true },
  date: String,
  message: String,
  notes: String,
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now },
})

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  company: String,
  service: String,
  location: String,
  notes: String,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
})

const settingSchema = new mongoose.Schema(
  { key: { type: String }, value: mongoose.Schema.Types.Mixed },
  { _id: false },
)

const Lead = mongoose.model('Lead', leadSchema)
const Client = mongoose.model('Client', clientSchema)
const Setting = mongoose.model('Setting', settingSchema)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

if (existsSync(join(CLIENT_DIST, 'index.html'))) {
  app.use(express.static(CLIENT_DIST))
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) {
      return next()
    }
    res.sendFile(join(CLIENT_DIST, 'index.html'))
  })
  console.log('Serving client build from', CLIENT_DIST)
}

let usingMongo = false

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      usingMongo = true
      console.log('Connected to MongoDB')
    })
    .catch((err) => {
      console.error('MongoDB connection failed, using file storage:', err.message)
    })
}

let transporter = null
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

function requireAdmin(req, res, next) {
  const pw = req.get('x-admin-password')
  if (!pw || pw !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  next()
}

async function sendLeadEmail(lead) {
  if (!transporter || !LEAD_EMAIL_TO) {
    console.warn('Email notification skipped: SMTP env vars not configured')
    return
  }
  try {
    await transporter.sendMail({
      from: `SecureForce Website <${SMTP_USER}>`,
      to: LEAD_EMAIL_TO,
      subject: `New service request: ${lead.service}`,
      text: [
        'A new request came in from the SecureForce website.',
        '',
        `Name: ${lead.name}`,
        `Phone: ${lead.phone}`,
        `Service: ${lead.service}`,
        `Location: ${lead.location}`,
        lead.date ? `Date: ${lead.date}` : '',
        lead.message ? `Details: ${lead.message}` : '',
        '',
        `WhatsApp the customer: https://wa.me/${String(lead.phone).replace(/\D/g, '')}`,
      ]
        .filter(Boolean)
        .join('\n'),
    })
  } catch (err) {
    console.error('Email notification failed:', err.message)
  }
}

async function readFileLeads() {
  try {
    const raw = await readFile(LEADS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeFileLeads(leads) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
}

async function getLeads() {
  if (usingMongo) {
    return Lead.find().sort({ createdAt: -1 }).lean()
  }
  return readFileLeads()
}

async function createLead(data) {
  if (usingMongo) {
    const lead = await Lead.create(data)
    return lead.toJSON()
  }
  const leads = await readFileLeads()
  const lead = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
  }
  leads.unshift(lead)
  await writeFileLeads(leads)
  return lead
}

async function getSettingsData() {
  if (usingMongo) {
    const doc = await Setting.findOne({ key: 'site' })
    return doc?.value || {}
  }
  try {
    const raw = await readFile(SETTINGS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function saveSettingsData(data) {
  if (usingMongo) {
    await Setting.findOneAndUpdate({ key: 'site' }, { $set: { value: data } }, { upsert: true })
    return
  }
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2))
}

async function readFileClients() {
  try {
    const raw = await readFile(CLIENTS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeFileClients(clients) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(CLIENTS_FILE, JSON.stringify(clients, null, 2))
}

async function getClients() {
  if (usingMongo) {
    return Client.find().sort({ createdAt: -1 }).lean()
  }
  return readFileClients()
}

async function createClient(data) {
  if (usingMongo) {
    const client = await Client.create(data)
    return client.toJSON()
  }
  const clients = await readFileClients()
  const client = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
  }
  clients.unshift(client)
  await writeFileClients(clients)
  return client
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', storage: usingMongo ? 'mongodb' : 'file' })
})

app.get('/api/leads', async (req, res) => {
  const leads = await getLeads()
  res.json(leads)
})

app.post('/api/leads', async (req, res) => {
  const { name, phone, service, location, date, message } = req.body || {}

  if (!name || !phone || !service || !location) {
    return res.status(400).json({ error: 'name, phone, service and location are required' })
  }

  const lead = await createLead({
    name: String(name).trim(),
    phone: String(phone).trim(),
    service: String(service).trim(),
    location: String(location).trim(),
    date: date ? String(date).trim() : '',
    message: message ? String(message).trim() : '',
    status: 'new',
  })

  sendLeadEmail(lead)
  res.status(201).json(lead)
})

app.get('/api/admin/leads', requireAdmin, async (req, res) => {
  const leads = await getLeads()
  res.json(leads)
})

app.patch('/api/admin/leads/:id', requireAdmin, async (req, res) => {
  const { status, notes } = req.body || {}
  if (status && !['new', 'contacted'].includes(status)) {
    return res.status(400).json({ error: 'status must be new or contacted' })
  }
  const update = {}
  if (status) update.status = status
  if (typeof notes === 'string') update.notes = notes
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'nothing to update' })
  }
  const { id } = req.params
  if (usingMongo) {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const lead = await Lead.findByIdAndUpdate(id, update, { new: true }).lean()
    if (!lead) return res.status(404).json({ error: 'not found' })
    return res.json(lead)
  }
  const leads = await readFileLeads()
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  leads[idx] = { ...leads[idx], ...update }
  await writeFileLeads(leads)
  res.json(leads[idx])
})

app.delete('/api/admin/leads/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  if (usingMongo) {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const lead = await Lead.findByIdAndDelete(id)
    if (!lead) return res.status(404).json({ error: 'not found' })
    return res.json({ ok: true })
  }
  const leads = await readFileLeads()
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  leads.splice(idx, 1)
  await writeFileLeads(leads)
  res.json({ ok: true })
})

app.get('/api/settings', async (req, res) => {
  res.json(await getSettingsData())
})

app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  const data = req.body
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'settings must be an object' })
  }
  await saveSettingsData(data)
  res.json({ ok: true })
})

app.get('/api/admin/clients', requireAdmin, async (req, res) => {
  res.json(await getClients())
})

app.post('/api/admin/clients', requireAdmin, async (req, res) => {
  const { name, phone, email, company, service, location, notes, status } = req.body || {}
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }
  const client = await createClient({
    name: String(name).trim(),
    phone: phone ? String(phone).trim() : '',
    email: email ? String(email).trim() : '',
    company: company ? String(company).trim() : '',
    service: service ? String(service).trim() : '',
    location: location ? String(location).trim() : '',
    notes: notes ? String(notes).trim() : '',
    status: ['active', 'inactive', 'closed'].includes(status) ? status : 'active',
  })
  res.status(201).json(client)
})

app.patch('/api/admin/clients/:id', requireAdmin, async (req, res) => {
  const allowed = ['name', 'phone', 'email', 'company', 'service', 'location', 'notes', 'status']
  const update = {}
  for (const key of allowed) {
    if (typeof req.body?.[key] === 'string') update[key] = req.body[key].trim()
  }
  if (update.status && !['active', 'inactive', 'closed'].includes(update.status)) {
    return res.status(400).json({ error: 'invalid status' })
  }
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'nothing to update' })
  }
  const { id } = req.params
  if (usingMongo) {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const client = await Client.findByIdAndUpdate(id, update, { new: true }).lean()
    if (!client) return res.status(404).json({ error: 'not found' })
    return res.json(client)
  }
  const clients = await readFileClients()
  const idx = clients.findIndex((c) => c.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  clients[idx] = { ...clients[idx], ...update }
  await writeFileClients(clients)
  res.json(clients[idx])
})

app.delete('/api/admin/clients/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  if (usingMongo) {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid id' })
    }
    const client = await Client.findByIdAndDelete(id)
    if (!client) return res.status(404).json({ error: 'not found' })
    return res.json({ ok: true })
  }
  const clients = await readFileClients()
  const idx = clients.findIndex((c) => c.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  clients.splice(idx, 1)
  await writeFileClients(clients)
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
