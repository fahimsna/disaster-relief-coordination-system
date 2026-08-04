# Disaster Response & Relief Coordination System

CSE471 Group 02 — a MERN-stack platform unifying incident reporting, volunteer
dispatch, donation management, and emergency alerting for disasters in Bangladesh.

## Tech Stack

- React (Vite) + TailwindCSS · Express.js + Mongoose/MongoDB
- Leaflet.js/OpenStreetMap (M1) · Open-Meteo Weather API (M2)
- Stripe Test Mode (M3) · Twilio SMS + Nodemailer (M4)
- Deployment: Render (backend) · Vercel (frontend)

## Team & Ownership

| Member | Name                | Owns                                                                              |
| ------ | ------------------- | --------------------------------------------------------------------------------- |
| M1     | Ibnul Ahsan Mayukh  | Disaster intake, live map, `server.js`, `App.jsx`, auth                           |
| M2     | Zihadul Islam Tasin | Volunteer registration/profile, weather safety tracker, task board, stage tracker |
| M3     | Fahim Shahriar Nur  | Donation campaigns, Stripe payments, campaign analytics                           |
| M4     | Ifaz Ahanaf Zaman   | Alerts, SMS/email notifications, PDF certificates                                 |

---

### Module 1 (Lab 5)

| Member | Feature                                                        |
| ------ | -------------------------------------------------------------- |
| 1      | Disaster incident intake + admin verification queue            |
| 2      | Volunteer registration & profile (NID/ID OCR via Tesseract.js) |
| 3      | Relief campaign & donation management (Stripe)                 |
| 4      | Alert configuration matrix (draft broadcasts)                  |

### Module 2 (Lab 6)

| Member | Feature                                         |
| ------ | ----------------------------------------------- |
| 1      | Live incident map (Leaflet.js)                  |
| 2      | Localized weather safety tracker (Open-Meteo)   |
| 3      | Fund allocation & transparency dashboard        |
| 4      | Emergency SMS broadcast (Twilio, mock fallback) |

### Module 3 (Lab 7)

| Member | Features                                                            |
| ------ | ------------------------------------------------------------------- |
| 1      | Emergency shelter directory · Regional crisis analytics dashboard   |
| 2      | Volunteer task assignment board · Relief distribution stage tracker |
| 3      | Donation receipt & history · Campaign analytics dashboard           |
| 4      | Donor thank-you email · Volunteer completion certificate (PDFKit)   |

## Getting Started

```bash
git clone https://github.com/ZI-Tasin/disaster-relief-coordination-system.git
cd disaster-relief-coordination-system
cp .env.example .env      # fill in your own values
cd backend && npm install
cd ../frontend && npm install
```

## Branching & Contribution

See `CONTRIBUTING.md` and `.github/pull_request_template.md`. Never push directly
to `main`/`dev`; all changes go through a PR into `dev`.

## Folder Structure

See `docs/file-ownership.md` for the authoritative file-ownership map.
