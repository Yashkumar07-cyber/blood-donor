<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=🩸%20BloodConnect&fontSize=55&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=Find%20Blood%20Donors%20Near%20You%20%E2%80%94%20Save%20Lives%20Instantly&descAlignY=62&descSize=18" width="100%"/>

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<br/>

> **Connect with verified blood donors in emergencies.**
> Find donors by blood group & location, create emergency requests, and get real-time alerts — all in one app.

</div>

---

## 📸 Preview

| | |
|---|---|
| ![Home](screenshots/home.png) | ![Donors List](screenshots/donors-list.png) |
| **Home — Search by blood group** | **Find Donors — List view with filters** |
| ![Map View](screenshots/map-view.png) | ![Register](screenshots/register.png) |
| **Map View — Donors on Leaflet map** | **Register — Seeker or Donor** |
| ![Create Request](screenshots/create-request.png) | ![Request Form](screenshots/request-submit.png) |
| **Emergency Request — Patient info & urgency** | **Emergency Request — Submit** |

---

## ✨ Features

- 🗺️ **Interactive Map** — Leaflet map showing nearby donors (no API key needed)
- 📍 **GPS Search** — Find donors within a custom radius using your location
- 🔴 **Blood Type Matching** — Auto-matches compatible blood groups
- ⚡ **Real-time Alerts** — Socket.io notifications when emergency requests are created
- 🔐 **JWT Auth** — Role-based access: Seeker / Donor / Admin
- 🆘 **Emergency Requests** — Create requests with urgency levels (Normal / Urgent / Critical)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Map | Leaflet + React-Leaflet *(free, no API key)* |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose + 2dsphere index) |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io |

---

## 🚀 Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/Yashkumar07-cyber/blood-donor-finder.git
cd blood-donor-finder
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run dev            # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:3000
```

### Environment Variables

**`backend/.env`**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blooddonor
JWT_SECRET=your_secret_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 API Endpoints

**Auth** — `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`

**Donors** — `GET /api/donors/nearby?lat=&lng=&radius=&bloodGroup=` · `POST /api/donors` · `PATCH /api/donors/availability`

**Requests** — `POST /api/requests` · `GET /api/requests?lat=&lng=&radius=` · `PATCH /api/requests/:id/respond`

---

## 📁 Project Structure

```
blood-donor-finder/
├── backend/
│   ├── controllers/        # authController, donorController, requestController
│   ├── models/             # User, Donor (2dsphere), BloodRequest
│   ├── routes/             # authRoutes, donorRoutes, requestRoutes
│   ├── middleware/         # JWT auth, error handler
│   └── server.js           # Express + Socket.io entry
│
└── frontend/
    ├── src/
    │   ├── pages/          # Home, FindDonors, CreateRequest, Dashboard, Register
    │   ├── components/     # Navbar, DonorCard, DonorMap, BloodBadge
    │   ├── context/        # AuthContext (JWT state)
    │   ├── hooks/          # useSocket (real-time alerts)
    │   └── services/       # api.js (Axios calls)
    └── vite.config.js
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push & open a Pull Request

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

**Made with ❤️ to save lives · ⭐ Star this repo if it helped you!**

</div>
