# Sevitech Client Dashboard

A Node.js web dashboard for managing leads scraped from Google Maps, viewing conversation history, and launching WhatsApp outbound campaigns. Built with Express.js, EJS templates, and Tailwind CSS. Deployed on Vercel.

---

## How It Works — Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Admin)                          │
└──────────┬──────────────────────────────────────────┬──────────┘
           │                                          │
           ▼                                          ▼
┌──────────────────────┐                  ┌──────────────────────┐
│  Express Dashboard   │◄────────────────►│     Airtable API     │
│  (Vercel Serverless) │                  │  (Clients + Messages)│
└──────────┬───────────┘                  └──────────────────────┘
           │
           ├──► POST /search/run  ──────► n8n Scraper Webhook
           │                              (scrapes Google Maps,
           │                               saves to Airtable)
           │
           └──► POST /campaign/run ─────► sevitech.site API
                                          (sends WhatsApp messages
                                           to New leads via n8n)
```

The dashboard is the central control panel:
- **Reads** client/message data from Airtable
- **Triggers** new lead scraping via an n8n webhook
- **Launches** WhatsApp outbound campaigns via the sevitech.site API

---

## Pages & Features

### Sidebar Navigation (in order)

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Stats overview + recent activity |
| Add new Clients | `/search` | Trigger Google Maps scraper |
| Clients | `/clients` | View, filter, and manage all leads |
| Outbound Campaign | `/campaign` | Send WhatsApp messages to New leads |
| Messages | `/messages` | View all conversation messages |
| Analytics | `/analytics` | Charts and breakdowns |
| Settings | `/settings` | Change password |

---

### Dashboard (`/dashboard`)
- Total clients, new today, active conversations, messages today
- Status breakdown (New / Responded / Interested / Was Sent / Closed)
- Recent activity timeline
- Integrated analytics charts (messages over time, platform usage, status distribution, sender breakdown)
- Auto-refreshes stats every 30 seconds

---

### Add new Clients (`/search`)
A scraper trigger form. Sends a POST to the n8n webhook which scrapes Google Maps and saves results to Airtable automatically.

**Two modes:**
- **By Keywords** — Enter search terms (one per line) + location. n8n appends location to each keyword and searches.
- **By Maps URL** — Paste a Google Maps search URL. n8n uses the exact area and zoom level from the URL.

**Fields:**
- Keywords (one per line) or Maps URL
- Location (e.g. "Milano, Italy") — used with keywords only
- Max results (default 50, max 500 per keyword)
- Test mode checkbox — uses the `webhook-test` endpoint (n8n must be in listen mode)

**Behavior:** Responds immediately with 200. Scraping runs in the background (1–3 min). Results appear in the Clients page automatically.

**Env vars used:**
- `N8N_WEBHOOK_URL` — production webhook
- `N8N_WEBHOOK_TEST_URL` — test webhook

---

### Clients (`/clients`)
Full lead management table.

**Filters:**
- Search by business name, phone, or conversation ID
- Status dropdown (New / Responded / Interested / Was Sent / Closed)
- Category text input (partial match)
- Date created range (Today / Last 7/30/90 days)

**Table columns:**
- Business name + category subtitle
- Phone
- Status — **inline editable dropdown** (changes saved to Airtable via AJAX without page reload)
- Category badge
- Socials — clickable icons (globe, Facebook, Instagram, LinkedIn, X, TikTok, YouTube) — only shown if the link exists
- Created date
- View button

**Export:** CSV export with all fields including all social links.

---

### Client Detail (`/clients/:id`)
Full detail view for a single client.

**Info panel:**
- Business name, category badge
- Phone, email, address, website
- Rating
- Social media icons section (only rendered if at least one link exists)
- Inline status change dropdown
- Conversation ID, created date, message count
- Export as PDF button

**Conversation panel:**
- WhatsApp-style chat view showing all messages
- Incoming (client) and outgoing (agent) message bubbles with timestamps

---

### Outbound Campaign (`/campaign`)
Launches a WhatsApp outbound campaign. The server proxies the request to the sevitech.site API with a Bearer token.

**Fields:**
- Category — All / Restaurant / Hotel / Cleaning / Clinic / Real Estate / Generic
- How many to send (default 20, max 200)
- Message textarea — the exact WhatsApp text to send
- Test mode checkbox

**Behavior:** Calls `POST https://sevitech.site/api/outbound/trigger` server-side. n8n picks up the request, finds leads with status "New" matching the category, and sends the message via +39 3510218513 with a 30-second delay between each send.

**Env vars used:**
- `OUTBOUND_API_URL` — production API endpoint
- `OUTBOUND_API_TEST_URL` — test endpoint
- `OUTBOUND_API_TOKEN` — Bearer token (the `wa_token` JWT from sevitech.site)

---

### Messages (`/messages`)
View all messages across all conversations. Filter by sender, platform, or search within message text. Export to CSV.

---

### Analytics (`/analytics`)
Charts with configurable date ranges (7 / 30 / 90 / 365 days):
- Messages over time (line chart)
- Platform breakdown (bar chart)
- Status distribution (pie chart)
- Sender breakdown (client vs agent)

---

### Settings (`/settings`)
Change the admin password. Note: password changes persist only for the current server instance. To make permanent changes, update `ADMIN_PASSWORD` in Vercel environment variables.

---

## Architecture

### Authentication
Passport.js with a Local Strategy. On login, credentials are compared directly against `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables — no database lookup, no bcrypt. This is stateless and works correctly in serverless environments.

Sessions are stored in a **signed cookie** (`cookie-session`) on the client side. No server-side session store is needed, making the app fully stateless and serverless-compatible.

### Serverless Compatibility (Vercel)
The app runs as a Vercel serverless function. Key design decisions for serverless:
- **`cookie-session`** instead of `express-session` — sessions survive across different function instances
- **Direct env var auth** instead of in-memory user store — no cold-start race conditions
- **`app.set('trust proxy', 1)`** — correct IP detection and secure cookie handling behind Vercel's reverse proxy

### Data Layer
All Airtable operations go through `services/airtableService.js`. It uses a shared `mapClient()` function to normalize record fields. The Airtable npm client handles pagination automatically.

### n8n Integration
Two webhook integrations with n8n:
1. **Scraper** (`/search`) — triggers a Google Maps scraping workflow that saves new leads to Airtable
2. **Campaign** (`/campaign`) — proxies to sevitech.site API which triggers an n8n workflow that sends WhatsApp messages

---

## Airtable Schema

### Clients Table
| Field | Type | Notes |
|---|---|---|
| `business_name` | Text | Primary identifier |
| `category` | Text | e.g. Cleaners, Hotel |
| `phone` | Text | Primary phone |
| `website` | URL | |
| `email` | Text | |
| `address` | Text | |
| `rating` | Number | 0–5 |
| `facebook` | URL | |
| `instagram` | URL | |
| `linkedin` | URL | |
| `twitter` | URL | |
| `tiktok` | URL | |
| `youtube` | URL | |
| `web_phones` | Text | Additional phones from website |
| `web_emails` | Text | Additional emails from website |
| `scraped_at` | DateTime | When the record was scraped |
| `Status` | Single select | New / Responded / Interested / Was Sent / Closed |
| `phone_type` | Single select | Mobile / Landline |
| `conversation_id` | Text | e.g. CONV-2026-540 |
| `created_time` | DateTime | |
| `Messages` | Linked records | Links to Messages table |

### Messages Table
| Field | Type |
|---|---|
| `conversation_id` | Text |
| `client` | Linked record |
| `message_text` | Long text |
| `sender` | Single select (Client / Agent) |
| `timestamp` | DateTime |
| `platform` | Single select (whatsapp / sms / messenger) |

---

## Environment Variables

Set all of these in Vercel → Project → Settings → Environment Variables.

```env
# Server
NODE_ENV=production

# Session (generate with: openssl rand -base64 32)
SESSION_SECRET=your-random-secret

# Admin login
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password

# Airtable
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...

# n8n Scraper Webhooks (Add new Clients page)
N8N_WEBHOOK_URL=https://sevitech.site/n8n/webhook/sevitech-scraper
N8N_WEBHOOK_TEST_URL=https://sevitech.site/n8n/webhook-test/sevitech-scraper

# Outbound Campaign API
OUTBOUND_API_URL=https://sevitech.site/api/outbound/trigger
OUTBOUND_API_TEST_URL=https://sevitech.site/n8n/webhook-test/sevitech-outbound-trigger
OUTBOUND_API_TOKEN=<wa_token from sevitech.site localStorage>
```

---

## Project Structure

```
├── config/
│   ├── airtable.js          # Airtable client + table names
│   └── passport.js          # Auth: compares against env vars, no DB
├── middleware/
│   ├── auth.js              # ensureAuthenticated / forwardAuthenticated
│   ├── errorHandler.js      # Global error handler
│   └── rateLimiter.js       # Rate limiting (5 login attempts / 15 min)
├── routes/
│   ├── auth.js              # GET/POST /auth/login, GET /auth/logout
│   ├── dashboard.js         # GET /dashboard, GET /dashboard/api/stats
│   ├── clients.js           # CRUD + export routes for /clients
│   ├── messages.js          # GET /messages + export
│   ├── analytics.js         # GET /analytics + /analytics/api/data
│   ├── settings.js          # GET/POST /settings/password
│   ├── search.js            # GET /search, POST /search/run (scraper proxy)
│   └── campaign.js          # GET /campaign, POST /campaign/run (API proxy)
├── services/
│   └── airtableService.js   # All Airtable read/write operations
├── utils/
│   ├── helpers.js           # formatDate, paginate, CSV/PDF export, status colors
│   └── validators.js        # express-validator rules for login + password change
├── views/
│   ├── partials/
│   │   ├── head.ejs         # <html><head> + opens body+flex container
│   │   ├── sidebar.ejs      # Navigation sidebar
│   │   ├── header.ejs       # Top header bar (title, user, theme toggle)
│   │   ├── content-start.ejs# Opens main content area + flash messages
│   │   ├── content-end.ejs  # Closes main + inner div
│   │   └── footer.ejs       # Toast container + main.js + </body></html>
│   ├── login.ejs            # Standalone login page (no partials)
│   ├── dashboard.ejs
│   ├── clients.ejs
│   ├── client-detail.ejs
│   ├── messages.ejs
│   ├── analytics.ejs
│   ├── settings.ejs
│   ├── search.ejs           # Add new Clients / scraper form
│   ├── campaign.ejs         # Outbound Campaign form
│   └── error.ejs
├── public/
│   ├── css/style.css
│   └── js/main.js           # Sidebar toggle, dark mode, toasts, session timeout
├── .env                     # Local env vars (not committed)
├── vercel.json              # Vercel deployment config
├── package.json
└── server.js                # App entry point
```

---

## Local Development

```bash
npm install
# create .env with your credentials (see Environment Variables above)
npm run dev   # starts with nodemon on http://localhost:3000
```

Default login: `admin` / `sevitech2024` (or whatever is in your `.env`)

## Deployment (Vercel)

The project deploys automatically to Vercel on every push to `main`.

```bash
git push origin main   # triggers auto-deploy
```

After changing environment variables in Vercel, redeploy manually:
Vercel → Deployments → Redeploy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 20 |
| Framework | Express.js 4 |
| Templates | EJS |
| Styling | Tailwind CSS (CDN) |
| Charts | Chart.js |
| Auth | Passport.js (local strategy) |
| Sessions | cookie-session (client-side, stateless) |
| Database | Airtable API |
| Icons | Font Awesome 6.5 |
| PDF export | PDFKit |
| CSV export | json2csv |
| Security | Helmet.js, express-rate-limit |
| Hosting | Vercel (serverless) |
| Automation | n8n (self-hosted at sevitech.site) |
