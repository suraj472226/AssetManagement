# Fluid Asset Flow: Full-Stack Asset Management System

## 🚀 Overview

**Fluid Asset Flow** is a comprehensive full-stack Asset Management System designed to track, audit, and manage organizational assets, maintenance requests, and user roles. This monorepo includes:

* **Backend:** TypeScript + Express API
* **Frontend:** React + Vite client
* **Database:** MongoDB (Mongoose ODM)

---

## ✨ Key Features

### Backend (API Services)

* **User Management**
  Secure signup/login, role-based access, authentication middleware.

* **Asset Lifecycle Management**
  CRUD for assets (create, read, update, delete).

* **Request Handling**
  Maintenance/repair request creation and management.

* **Audit Logging**
  Track all system changes and activities.

* **Reporting System**
  Generate and manage system reports.

* **Security**
  Authorization middleware (admin, auth) and robust error handling.

---

### Frontend (User Interface)

* **Dashboard**
  KPI overview and quick insights.

* **Asset Management**
  Modular UI components for asset display and control.

* **Modern UI/UX**
  Built with shadcn/ui + Tailwind CSS.

* **Auth Context**
  Global state for user authentication.

* **Forms & Modals**
  Add new assets and create maintenance requests.

* **Routing**
  Pages: Dashboard, Assets, Requests, Maintenance, Reports, Login, Signup, etc.

---

## 🛠️ Technology Stack

### Backend

| Technology         | Description                        |
| ------------------ | ---------------------------------- |
| Node.js / Express  | Fast JS runtime + server framework |
| TypeScript         | Strong typing                      |
| MongoDB / Mongoose | NoSQL database + ODM               |
| JWT & bcryptjs     | Secure authentication and hashing  |

### Frontend

| Technology   | Description                         |
| ------------ | ----------------------------------- |
| React        | UI library                          |
| Vite         | Fast build tool                     |
| TypeScript   | Type safety                         |
| Tailwind CSS | Utility-first styling               |
| Shadcn UI    | Modern UI components                |
| bun          | Fast dependency manager (bun.lockb) |

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have:

* Node.js v18+
* Git
* MongoDB (Local or Atlas)

---

## 📁 Setup Instructions

### 1. Clone the Repository

```bash
git clone <YOUR_REPO_URL>
cd AssetM
```

---

## 2. Backend Setup (`backend/`)

```bash
cd backend
npm install
```

Or using yarn/bun:

```bash
yarn install
bun install
```

### Backend Environment Variables

Create: `backend/.env`

```env
JWT_SECRET="YOUR_OWN_VERY_STRONG_SECRET_KEY"
DATABASE_URL="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/fluid_asset_flow?retryWrites=true&w=majority"
PORT=5000
client_origin=http://localhost:8080
```

---

## 3. Frontend Setup (`frontend/`)

```bash
cd ../frontend
npm install
```

Or:

```bash
bun install
```

### Frontend Environment Variables

Create: `frontend/.env`

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

## ▶️ Running the Application

### Start the Backend API

From the `backend/` directory:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### Start the Frontend Client

From the `frontend/` directory:

```bash
npm run dev
```

Frontend runs at: `http://localhost:8080`

---

Enjoy using **Fluid Asset Flow**!
