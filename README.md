# 🩸 Blood Donor Finder — Full Stack App

Find and connect with nearby blood donors in emergencies. Real-time alerts, geolocation search, and donor registry.

---

## 📁 Project Structure

```
blood-donor-finder/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me
│   │   ├── donorController.js  # Donor CRUD + geosearch
│   │   └── requestController.js# Blood request + notify
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + authorize
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Donor.js            # Donor + 2dsphere index
│   │   └── BloodRequest.js     # Request + matched donors
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── donorRoutes.js
│   │   └── requestRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express + Socket.io entry
│
└── frontend/                   # React + Vite + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── BloodBadge.jsx
    │   │   ├── donor/
    │   │   │   └── DonorCard.jsx
    │   │   └── map/
    │   │       └── DonorMap.jsx  # Leaflet map (free, no key)
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state + JWT
    │   ├── hooks/
    │   │   └── useSocket.js      # Real-time donor alerts
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── FindDonors.jsx    # Map + list view + filters
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateRequest.jsx # Emergency request form
    │   │   └── DonorRegister.jsx # Donor onboarding
    │   ├── services/
    │   │   └── api.js            # Axios + all API calls
    │   ├── App.jsx               # Router + protected routes
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: add MONGODB_URI and JWT_SECRET
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if backend URL differs
npm run dev
# App runs on http://localhost:3000
```

---

## 🔑 Environment Variables

**Backend `.env`:**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blooddonor
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donors/nearby?lat=&lng=&radius=&bloodGroup=` | Find nearby donors |
| POST | `/api/donors` | Register as donor |
| PUT | `/api/donors/me` | Update donor profile |
| PATCH | `/api/donors/availability` | Toggle availability |

### Blood Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests` | Create emergency request |
| GET | `/api/requests?lat=&lng=&radius=` | Get nearby requests |
| PATCH | `/api/requests/:id/respond` | Donor responds |
| GET | `/api/requests/my` | My requests |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| Map | Leaflet + React-Leaflet (free, no API key) |
| HTTP Client | Axios |
| Real-time | Socket.io client |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io |
| Security | Helmet, CORS, Rate limiting |
| Geolocation | MongoDB 2dsphere index + $near query |

---

## 🌟 Key Features

- 🗺️ **Map view** with Leaflet (free, no Google Maps API key needed)
- 📍 **Geolocation search** — find donors within X km using GPS
- 🔴 **Blood type compatibility** — auto-matches compatible donor groups
- ⚡ **Real-time notifications** via Socket.io when emergency request is created
- 🔐 **JWT authentication** with role-based access (seeker / donor / admin)
- 📱 **Responsive design** works on mobile and desktop

---

## 🚢 Deployment

**Frontend → Vercel:**
```bash
cd frontend && npm run build
# Deploy dist/ folder to Vercel
```

**Backend → Render:**
- Connect GitHub repo
- Set root directory to `backend/`
- Add environment variables in Render dashboard

**Database → MongoDB Atlas** (free tier available)
