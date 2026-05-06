# 🏠 King Property Auction Platform

Full-stack MERN (MongoDB, Express, React, Node.js) real estate auction platform covering the complete UK property auction lifecycle.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **State** | Zustand (auth) + React Query (server) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcrypt + HTTP-only cookies |

---

## 📋 Prerequisites

- **Node.js** v18+ 
- **MongoDB** v7+ (local or Atlas)
- **npm** v9+

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Arsxols562/king-property-auction.git
cd king-property-auction
2. Install dependencies
bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
3. Configure environment
Create .env in the backend/ folder:

env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/kingproperty
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
4. Start the application
bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
5. Access
Website: http://localhost:5173

Admin Panel: http://localhost:5173/admin

API: http://localhost:5000

👤 Default Admin Account
Create via MongoDB Compass or mongosh:

js
use kingproperty
db.users.insertOne({
  name: "Admin",
  email: "admin@kingproperty.com",
  password: "$2a$12$...", // bcrypt hash of your password
  role: "admin",
  isActive: true
})
📂 Project Structure
text
king-property-auction/
├── src/                          # Frontend (React + TypeScript)
│   ├── features/
│   │   ├── admin/                # Admin dashboard
│   │   ├── auction/              # Auction pages & components
│   │   ├── auth/                 # Login/Register
│   │   ├── bid/                  # Bidding API hooks
│   │   ├── property/             # Property pages & API
│   │   ├── shared/               # Shared UI, layout, components
│   │   └── website/              # Public info pages
│   ├── lib/                      # API client
│   ├── stores/                   # Zustand stores
│   └── styles/                   # Tailwind CSS
├── backend/
│   └── src/
│       ├── modules/
│       │   ├── auth/             # Authentication
│       │   ├── auction/          # Auction management
│       │   ├── bid/              # Bidding system
│       │   ├── dashboard/        # Admin statistics
│       │   ├── lead/             # Contact forms
│       │   ├── property/         # Property management
│       │   └── user/             # User management
│       ├── middlewares/          # Auth, error handling, upload
│       └── config/               # Database, environment
└── README.md
🔐 Features
Authentication
JWT access tokens (15 min) + refresh tokens (7 days)

HTTP-only cookies for refresh tokens

Silent token refresh on 401

Role-based access (Admin, Agent, User)

Bcrypt password hashing (12 rounds)

Property Management
Full CRUD with image upload (up to 20 images)

Admin approval workflow (pending → approved/rejected)

SEO-friendly slugs

Embedded location, pricing, specifications, features, legal info

Auction System
Live, online, and hybrid auction types

Per-property bidding (each lot has independent current bid)

Reserve price tracking (✅ Met / ❌ Not Met)

Countdown timers on all pages

Bidding
Real-time bid placement with validation

Per-property bid history

Auto-bidding / Proxy bidding (like eBay & Sotheby's)

Admin/Agent cannot bid (role restriction)

Pending users cannot bid (activation required)

8 Dynamic Frontend Pages
Page	URL
Homepage / Property Search	/website
Property Detail	/properties/:slug
Auction Detail	/auctions/:slug
Live Auctions	/live-auctions
Auctions List	/auctions
View All Lots	/view-all-lots
Auction Properties	/auctions/:slug/properties
Login / Register	/login
Admin Dashboard
Real-time stats (properties, auctions, users, bids)

Property approval/rejection

User activation/deactivation

Auction creation & management

Page builder & menu manager

🗄️ Database Schema
5 Collections: users, properties, auctions, bids, leads

🔒 Security
Helmet security headers

CORS whitelisted origins

Rate limiting (100 req/15min)

Joi input validation on all endpoints

Mongoose NoSQL injection prevention

📄 License
Private - All rights reserved.