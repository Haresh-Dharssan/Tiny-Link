# 🔗 TinyLink — URL Shortener (Node.js + Express + React + Tailwind + Postgres)

TinyLink is a modern, full-stack URL shortener similar to Bit.ly, built using:

- **Node.js + Express** (REST API & redirect service)
- **React + Vite** (frontend dashboard)
- **Tailwind CSS** (UI styling)
- **PostgreSQL (Neon)** (database)
- **Render** (deployment)

This project was built as a complete full-stack assignment — fully deployed and production-ready.

---

## 🚀 Live Demo

### **Frontend**
👉 https://tiny-link-frontend-0fi3.onrender.com/

### **Backend API**
👉 https://tiny-link-mxvz.onrender.com/

### **Short Link Example**
👉 https://tiny-link-mxvz.onrender.com/ysearch

---

## ✨ Features

### 🔧 **Core Features**
- Create shortened URLs
- Custom short codes (A-Z, a-z, 0-9, length 6–8)
- Auto-generated random codes
- Redirect via `/:code`
- Link analytics (click count + last clicked)
- Fully responsive UI (mobile + desktop)
- Search/filter links
- Copy link button
- Delete short links

### 📊 **Dashboard**
- View all created links
- Sort, filter, and manage
- Truncated ellipsis for long URLs
- Live updating click counts (polling)
- Stats page for each code

### 🛠 **System**
- Health check (`/healthz` JSON)
- Clean route structure
- Production-ready CORS setup
- Auto-refresh of analytics
- Deployed backend & frontend separately

---

## 🏗 Tech Stack

### **Frontend**
- React
- Vite
- React Router
- Tailwind CSS (v3)
- Axios

### **Backend**
- Node.js
- Express
- pg (PostgreSQL)

### **Database**
- Neon Postgres

### **Deployment**
- Render (Backend)
- Render (Frontend Static Hosting)

---

## 📁 Project Structure
```
tinylink/
│
├── backend/
│ ├── src/
│ │ ├── server.js
│ │ ├── db.js
│ │ ├── routes/
│ │ ├── utils/
│ ├── package.json
│
└── frontend/
├── src/
├── public/
│ └── _redirects
├── package.json
```

---

## 🔌 API Endpoints (Backend)

### **Create short link** 
`POST /api/links`

### **List all links**
`GET /api/links`

### **Get stats for a specific code**
`GET /api/links/:code`

### **Delete link**
`DELETE /api/links/:code`

### **Redirect to original URL**
`GET /:code`
Redirects using HTTP 302.

### **Health Checks**
JSON health: `GET /healthz`

---

## 🛠 **Environment Variables**
### **Backend**
```
DATABASE_URL="your database url"
BASE_URL="your backend url"
NODE_ENV=production
```

### **Frontend**
```
VITE_API_URL= https://your-backend-url
```

---
## 🧪 **Local Development**
### **Backend**
```bash
cd backend
npm install
npm start
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 **Deployment (Render)**
### **Backend**
- Web Service
- Root Directory: `backend/`
- Build Command: `npm install`
- Start Command: `npm start`

### **Frontend**
- Static Site
- Root Directory: `frontend/`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

---

## 📄 **License**

MIT License — free to use, modify, and distribute.

---

## ⭐ **Acknowledgements**

Special thanks to:
- Neon for hosting PostgreSQL
- Render for free hosting
- TailwindCSS
- React Router
