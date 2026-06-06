# Kloche Interiors CRM & Website

A complete, production-ready full-stack business website and integrated Client Relationship Management (CRM) platform designed specifically for **Kloche Interiors**—a high-end, bespoke interior design and remodeling studio based in Westlands, Nairobi.

---

## 🏛️ Project Architecture

This application utilizes a modern, unified, full-stack architecture pairing a rich **React + Vite** frontend with a secure **Express + Node.js** backend, connected to a robust, file-based **SQLite** database managed via the **Prisma ORM**.

```
📁 Kloche-Interiors/
├── 📁 prisma/                 # Database Schema & Seed Engine
│   ├── schema.prisma          # SQLite Schema models (Enquiry, Client, Appointment)
│   └── seed.ts                # Realistic dataset seeder (Nairobi Leads)
├── 📁 src/
│   ├── 📁 components/         # Highly Modular React Components
│   │   ├── 📁 home/           # Homepage Bento Sections (Hero, Process, Contact)
│   │   ├── 📁 layout/         # Shared Navbars, Footers, and Floats
│   │   └── 📁 admin/          # CRM Admin Views, Tables, & FullCalendar
│   ├── 📁 lib/                # Shared Library Utilities
│   │   ├── prisma.ts          # Pris Client Singleton
│   │   ├── email.ts           # Gmail SMTP Nodemailer Broker
│   │   └── validations.ts     # Zod strict schema fields
│   ├── App.tsx                # main client routes
│   └── index.css              # Swish luxury CSS styles and custom cursor
├── server.ts                  # express unified web entrypoint
└── package.json               # dependencies config
```

---

## ✨ Features Key Core Modules

### 1. Refined Public Showcase (Vite / React SPA)
- **Visual Identity**: Tailored styling using a clean black/white/beige high-contrast theme (**Cream**, **Charcoal**, **Gold**).
- **Responsive Navigation Desk-First**: Integrated scroll-triggering responsive `<Navbar />` with animated transparent shifts.
- **Hero & Interactive bento grids**: Bold typographic layouts paired with overlapping CSS collage grids showcasing authentic Nairobi milestones.
- **Services Grid**: Lists 6 core offerings: *Interior Design, Renovation, Short Let Styling, Office Design, Space Planning, and Furniture & Decor*.
- **Timeline Process**: Clean horizontal step-by-step roadmap guiding clients from initial site dimensions to final key handovers.
- **Form Submission Validation**: Real-time validated `<ContactForm />` powered by **React Hook Form** + **Zod**.
  - Logs enquiries into the database.
  - Sends a direct dispatch to server side SMTP email relays.
  - Generates pre-filled, URL-encoded **direct WhatsApp redirects** on submission.
- **Custom Aesthetic Cursor**: Smooth trailing custom cursor pairing a small gold center dot with a tracking outer orbit.

### 2. CRM Admin Administration (Express API / React Routing)
Navigate to `/admin` to open the full-scale executive panel containing:
- **Metrics Dashboard**: Monitors absolute customer metrics, unread weekly leads counts, active project lists, and month-to-month calendar bookings.
- **Lead Enquiries Hub**: Filters live leads by status (*New*, *Read*, *Replied*). Features direct row expansion, instant status flags PATCHing, single-click client conversions, and wa.me prompt shortcuts.
- **Client CRM Directory**: Lists lifetime customer files.
- **Single-Client Dossier Profiles (`/admin/clients/:id`)**:
  - Displays contact coordinates and historical milestones.
  - Links cumulative walkthrough enquiries and appointments histories.
  - **Autosaving Walkthrough Notes Box**: Fully editable textual workspace that automatically saves metadata details to the database on input blur!
- **Interactive Chronos Scheduler (`/admin/appointments`)**: Full visual monthly grid powered by **FullCalendar React**. Click scheduler tiles to update appointments, drag/click dates to schedule slots, assign links to CRM clients, or wipe booked sessions.

---

## ⚙️ Direct Setup & Local Running

Follow these direct steps to run and test the application on your workspace:

### 1. Configure Secrets & Environment Variables
Copy `.env.local.example` into a new `.env` file at root level:
```env
# Mailbox SMTP Config
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="studio.kloche@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"    # Google App Password credentials
EMAIL_OWNER="recipient@domain.com" # Studio recipient email address
```

### 2. Install Project Dependencies
Run npm to install all lock files:
```bash
npm install
```

### 3. Initialize the Prisma DB Schema
Push the defined schema structures directly to create the SQLite file:
```bash
npx prisma db push
```

### 4. Seed Simulated CRM Records
Inject pre-loaded clients, active appointments, and unread enquiries:
```bash
npx tsx prisma/seed.ts
```

### 5. Launch Development Server
Boot up high-speed HMR server running unified endpoints on port `3000`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live app!

---

## 🚀 Build and Deploy

To compile the codebase for cloud deployment or production servers:
```bash
npm run build
```
This script triggers asset optimization and transpiles the server code using `esbuild` to group components inside a single bundled file at `dist/server.cjs`.

Run the production server:
```bash
npm start
```
