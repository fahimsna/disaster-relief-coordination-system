untitled folder 13.zip
Zip Archive
help me fix the issues of strive payment and others
Yes — now we have the exact cause.
Your current production frontend is:

disaster-relief-coordination-system-steel.vercel.app

Your backend is:

disaster-relief-coordination-system-kmf2.onrender.com

But your uploaded project's backend .env still contains:

CLIENT_URL=https://disaster-relief-coordination-system-five.vercel.app
That is wrong.
Your Stripe code constructs the success URL from process.env.CLIENT_URL, so after Stripe payment it can send the user to the old Vercel deployment instead of the current steel deployment.

That perfectly explains:

Current site login → Stripe → old Vercel site → no current localStorage session → "Please log in" → history unavailable.

And Render's environment variables are runtime configuration; after changing them, you need to redeploy for the service to use the new value.

Fix this first

1. Render → Environment
   Open your Render service:
   disaster-relief-coordination-system-kmf2

Set:

CLIENT_URL=https://disaster-relief-coordination-system-steel.vercel.app
Do not use:
https://disaster-relief-coordination-system-five.vercel.app
Save it and choose Save, rebuild, and deploy (or save/deploy according to the Render UI). Render documents that environment variables only become active after deployment when using the appropriate save/deploy option. 2. Vercel → Production Environment Variables
For your current Vercel project, make sure this exists under Production:
VITE_API_URL=https://disaster-relief-coordination-system-kmf2.onrender.com/api
Then redeploy Vercel.
Your source already has the correct fallback:

https://disaster-relief-coordination-system-kmf2.onrender.com/api
but I want the production environment variable explicitly set so there is no ambiguity. Vite embeds VITE\_\* variables into the frontend at build time, so changing it requires a new Vercel deployment. 3. Stripe webhook
Your Stripe webhook should point to:
https://disaster-relief-coordination-system-kmf2.onrender.com/api/donations/webhook
And Render must have the matching:
STRIPE_SECRET_KEY=your_real_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_real_webhook_signing_secret
Don't send those secrets to me.
There is another important problem in your code
Your PaymentSuccess.jsx immediately does this:
const token = localStorage.getItem("token");

if (!token) {
setError("Please log in to view your donation receipt.");
...
}
That means if Stripe redirects to any different Vercel hostname, the browser has a different localStorage.
So even though you were logged in before paying, the payment page sees:

token = null
and gives you exactly the message you're seeing.
Therefore, changing CLIENT_URL is the first and most important fix.

Why "No campaigns found" happens too
Your campaigns endpoint is actually public:
GET /api/campaigns
So it does not require a login token.
That means the fact that campaigns disappear after the payment strongly suggests you're ending up on the wrong/stale frontend deployment or that the deployed frontend has the wrong API build variable.

The current frontend should call:

https://disaster-relief-coordination-system-kmf2.onrender.com/api/campaigns
The backend exposes that route publicly.
So we should not fix this by adding authentication to campaigns. The production URL/configuration is the thing to fix.

Do these 2 changes now
Render
CLIENT_URL
=
https://disaster-relief-coordination-system-steel.vercel.app
Vercel Production
VITE_API_URL
=
https://disaster-relief-coordination-system-kmf2.onrender.com/api
Then:
Render → redeploy

and

Vercel → redeploy

Render web services are publicly available through their onrender.com URL, and the service must be running/bound correctly for the API to receive requests.

After redeployment
Log out of the current site completely.
Then open:

Your current production site

Log in again.

Then test:

Campaigns → choose campaign → Donate → Stripe → complete payment.

The expected flow should now be:

steel.vercel.app
↓
Render API
↓
Stripe Checkout
↓
steel.vercel.app/payment-success
↓
Render API verifies session
↓
Donation receipt
↓
Donation history
Do not change the code yet. First make those two production environment changes and redeploy both services.
Then tell me what happens after you make the payment. If it still fails, give me the exact browser Console error + Network status for /donations/receipt/..., and I'll move to the next code fix with the complete replacement file.
fixed it and everything is fixed
Excellent! 🎉
So the Stripe payment, donation receipt, donation history, and campaign loading issues are all fixed in production.

Your deployed setup is now correctly aligned:

✅ Vercel frontend
✅ Render backend
✅ Production API URL
✅ Stripe redirect
✅ Authentication after Stripe
✅ Donation receipt
✅ Donation history
✅ Campaign loading
We can move on to the next issue/feature in Gontobbo.
now update the readme properly
Done. I updated the README properly to match the current deployed project, including:
Current Vercel production URL
Current Render backend URL
Health-check URL
Full feature list
Frontend/backend tech stack
Project structure
Local setup
Production environment variables
Stripe donation flow and webhook
Deployment instructions for Vercel + Render
API areas
Security notes
Team/module ownership
Contribution workflow
Production verification checklist
Full replacement README.md
Download the updated README.md
Replace your existing:

README.md
with this file and commit/push it to GitHub.
I also made sure the README uses your current production domains rather than the old -five.vercel.app URL.

README.md
Document

Your file library is full. New files won't be saved to your library, but you can still use them in this chat. To store new files for later, free up space or upgrade your storage.
Upgrade

Manage

Library
/
README.md

Disaster Response & Relief Coordination System
A full-stack disaster response and relief coordination platform for Bangladesh. The system brings together disaster reporting, volunteer management, emergency coordination, shelters, weather safety, relief campaigns, online donations, fund transparency, alerts, notifications, analytics, and operational task tracking in one web application.
Live Deployment
Frontend
https://disaster-relief-coordination-system-steel.vercel.app/
Backend API
https://disaster-relief-coordination-system-kmf2.onrender.com/
Backend Health Check
https://disaster-relief-coordination-system-kmf2.onrender.com/health
The frontend is deployed on Vercel and the backend API is deployed on Render.

Main Features
Authentication & User Management
User registration and login
JWT-based authentication
Role-based access control
Protected volunteer and admin functionality
Volunteer profile management
Admin verification workflow
Disaster & Incident Management
Disaster/incident reporting
Admin verification queue
Incident severity handling
Incident command map
Regional crisis analytics
Severity threshold configuration
Volunteer Management
Volunteer registration
Volunteer profile
NID/ID document OCR using Tesseract.js
Volunteer verification
Volunteer task assignment
Task progress tracking
Mission/distribution stage tracking
Volunteer completion certificate generation
Relief Campaigns & Donations
Relief campaign creation and management
Campaign details and progress
Donor contribution flow
Stripe Checkout integration
Donation payment success/cancel handling
Stripe webhook processing
Donation receipt
Donation history
Campaign fundraising analytics
Fund allocation and transparency tracking
Donor thank-you email support
Emergency Response
Emergency shelter directory
Shelter management for administrators
Live incident map
Emergency SMS broadcasting
Alert configuration
Email notifications
Weather safety tracking
Regional weather information
Dashboards & Analytics
Main dashboard
Admin dashboard
Campaign analytics dashboard
Crisis analytics dashboard
Fund allocation dashboard
Weather safety tracker
Operational stage feed
Task assignment board
Technology Stack
Frontend
React 19
Vite
React Router
Tailwind CSS
Axios
React Hot Toast
Leaflet / React Leaflet
Chart.js / react-chartjs-2
Lucide React
Tesseract.js
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
Axios
Stripe
Nodemailer
Twilio
PDFKit
CORS
External Services
Stripe — online donation payments
Open-Meteo — weather data
OpenStreetMap / Leaflet — maps
Twilio — SMS notifications
Nodemailer — email notifications
Tesseract.js — OCR processing
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB / MongoDB Atlas-compatible connection
Project Structure
Disaster Response & Relief Coordination System/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── data/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── config/
│ │ ├── context/
│ │ ├── data/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.css
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
│
├── docs/
├── README.md
└── package.json
Getting Started Locally

1. Clone the repository
   git clone https://github.com/ZI-Tasin/disaster-relief-coordination-system.git
   cd disaster-relief-coordination-system
2. Install backend dependencies
   cd backend
   npm install
3. Configure backend environment variables
   Create:
   backend/.env
   Use the following variables as a reference. Never commit real credentials or secrets to GitHub.
   PORT=8009
   NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_CURRENCY=bdt

ADMIN_NAME=your_admin_name
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

MAIL_USER=your_email
MAIL_PASS=your_email_password_or_app_password

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
Only configure the integrations you actually use. Keep all secret values private. 4. Start the backend
From the backend directory:
npm run dev
The local API runs on:
http://localhost:8009
Health check:
http://localhost:8009/health 5. Install frontend dependencies
Open another terminal:
cd frontend
npm install 6. Configure frontend environment
For local development, create:
frontend/.env
Set the API base URL used by the frontend:
VITE_API_URL=http://localhost:8009/api
If a different frontend API variable is used by a specific notification integration, configure it according to the corresponding source file/configuration. 7. Start the frontend
npm run dev
Vite will normally serve the application at:
http://localhost:5173
Production Configuration
The current production deployment uses:

# Vercel - Production

VITE_API_URL=https://disaster-relief-coordination-system-kmf2.onrender.com/api
and:

# Render - Production

CLIENT_URL=https://disaster-relief-coordination-system-steel.vercel.app
Important
The Vercel frontend URL and Render CLIENT_URL must stay synchronized.
If the frontend domain changes, update the Render CLIENT_URL environment variable and redeploy the backend.

If the Render API URL changes, update the Vercel VITE_API_URL environment variable and redeploy the frontend.

Because Vite environment variables are embedded during the frontend build, a Vercel redeployment is required after changing a VITE\_\* production variable.

Stripe Donation Flow
The donation system uses Stripe Checkout.
The normal production flow is:

User selects a relief campaign
↓
Donation form
↓
Backend creates Stripe Checkout Session
↓
User completes payment on Stripe
↓
Stripe redirects to the production payment-success page
↓
Backend verifies/payment state is checked
↓
Stripe webhook confirms the payment server-side
↓
Donation is finalized
↓
Receipt and donation history become available
↓
Campaign totals/analytics are updated
Stripe Webhook
The production Stripe webhook endpoint should be configured as:
https://disaster-relief-coordination-system-kmf2.onrender.com/api/donations/webhook
The webhook signing secret must be stored only in the Render environment variables as:
STRIPE*WEBHOOK_SECRET=your_webhook_signing_secret
Do not put Stripe secret keys or webhook secrets in the frontend, source control, README, screenshots, or public documentation.
Important API Areas
The backend exposes API groups including:
/api/auth
/api/reports
/api/volunteers
/api/thresholds
/api/locations
/api/shelters
/api/analytics
/api/weather
/api/campaigns
/api/donations
/api/notifications
/api/fund-allocations
/api/sms
/api/stage-updates
/api/campaign-analytics
The backend also provides:
GET /health
for deployment/service health checking.
Development Commands
Backend
cd backend
npm install
npm run dev
Production/start command:
npm start
Frontend
cd frontend
npm install
npm run dev
Production build:
npm run build
Preview the production build locally:
npm run preview
Lint:
npm run lint
Deployment
Frontend — Vercel
Recommended settings:
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Production environment variable:
VITE_API_URL=https://disaster-relief-coordination-system-kmf2.onrender.com/api
After changing any VITE*\* variable, redeploy the Vercel project.
Backend — Render
Recommended settings:
Root Directory: backend
Build Command: npm install
Start Command: npm start
Required production configuration includes:
NODE_ENV=production
PORT=<provided by Render when applicable>
MONGODB_URI=<production MongoDB connection>
JWT_SECRET=<private JWT secret>
CLIENT_URL=https://disaster-relief-coordination-system-steel.vercel.app
STRIPE_SECRET_KEY=<private Stripe secret>
STRIPE_WEBHOOK_SECRET=<private Stripe webhook secret>
STRIPE_CURRENCY=bdt
Configure email and Twilio variables as needed for those integrations.
Security Notes
Never commit .env files containing real credentials.
Never expose STRIPE_SECRET_KEY in React/Vite code.
Never expose STRIPE_WEBHOOK_SECRET in the frontend.
Never expose JWT_SECRET publicly.
Use HTTPS in production.
Keep CORS restricted to the intended production frontend origin.
Use strong, unique production secrets.
Rotate compromised credentials immediately.
Do not place API keys or service credentials in README files.
Team & Module Ownership
Member Name Primary Responsibilities
M1 Ibnul Ahsan Mayukh Disaster intake, live map, shelters, crisis analytics
M2 Zihadul Islam Tasin Volunteer management, weather safety, task board, mission/stage tracking
M3 Fahim Shahriar Nur Donation campaigns, Stripe payments, donation receipt/history, campaign analytics, authentication
M4 Ifaz Ahanaf Zaman Alerts, SMS/email notifications, PDF certificates
Module 1 — Lab 5
Member Features
M1 Disaster incident intake and admin verification queue
M2 Volunteer registration/profile and NID/ID OCR
M3 Relief campaigns and Stripe donation management
M4 Alert configuration matrix
Module 2 — Lab 6
Member Features
M1 Live incident map
M2 Localized weather safety tracker
M3 Fund allocation and transparency dashboard
M4 Emergency SMS broadcast
Module 3 — Lab 7
Member Features
M1 Emergency shelter directory and regional crisis analytics
M2 Volunteer task assignment and relief distribution stage tracker
M3 Donation receipt/history and campaign analytics
M4 Donor thank-you email and volunteer completion certificate
Contribution Workflow
Create or switch to a feature branch.
Make the required changes.
Test the frontend and backend locally.
Run the frontend build and lint checks.
Verify API endpoints and authentication.
Test payment-related changes carefully in the appropriate Stripe environment.
Commit the changes with a clear message.
Push the feature branch.
Open a pull request into the development branch according to the team's workflow.
Do not push secrets or production .env files to GitHub.
Production Verification Checklist
Before considering a deployment complete, verify:

Frontend opens from the current Vercel production URL.

Backend /health endpoint responds successfully.

Login works in production.

Registration works in production.

Campaign list loads.

Campaign details load.

Donation checkout opens correctly.

Stripe payment redirects back to the current Vercel domain.

Donation receipt loads after a successful payment.

Donation history loads for the authenticated donor.

Campaign totals and analytics update correctly.

Admin authentication works.

Volunteer workflows work.

Shelter directory works.

Incident/report workflows work.

Weather data loads.

Maps load correctly.

Notifications/SMS work when their services are configured.

No production console errors remain.
Current Production URLs
Frontend:
https://disaster-relief-coordination-system-steel.vercel.app/
Backend:
https://disaster-relief-coordination-system-kmf2.onrender.com/

Health:
https://disaster-relief-coordination-system-kmf2.onrender.com/health

Academic Project
This project was developed as a CSE471 Group 02 disaster response and relief coordination system. It demonstrates a MERN-based architecture integrating authentication, disaster operations, volunteer coordination, maps, weather services, notifications, relief campaigns, online payments, and analytics.
