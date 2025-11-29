Fluid Asset Flow: Full-Stack Asset Management System

🚀 Overview

Fluid Asset Flow is a comprehensive, full-stack Asset Management System designed to track, audit, and manage organizational assets, maintenance requests, and user roles efficiently. The application is built as a unified repository (monorepo structure) hosting both a TypeScript/Express backend API and a modern React/Vite frontend.

✨ Key Features

Based on the folder structure provided, this application includes the following core functionalities:

Backend (API Services)

User Management: Secure signup and login, handling user roles and authentication (userController, User model, auth middleware).

Asset Lifecycle: CRUD operations for managing assets (creation, retrieval, updates, and deletion) (assetController, Asset model).

Request Handling: System for users to create and manage maintenance or repair requests (requestController, Request model).

Audit Logging: Tracking system activity and changes (Audit model).

Reporting: Utilities to generate and manage various system reports (reportController, generateReport).

Security: Middleware for authorization (admin, auth) and robust error handling.

Frontend (User Interface)

Dashboard: Central view for key performance indicators (KPIs) and system overview (Dashboard.tsx, KPIBox.tsx).

Modular Assets View: Displaying and managing assets using reusable components (Assets.tsx, AssetCard.tsx).

Theming and UI: Modern, responsive interface built with Shadcn UI components (e.g., button, card, dialog) and Tailwind CSS.

Context Management: Global state management for authentication (AuthContext.tsx).

Form Handling: Dedicated components for adding assets and creating new requests (AddAssetForm.tsx, NewRequestForm.tsx).

Page Routing: Dedicated pages for all core functions: Dashboard, Assets, Requests, Maintenance, Reports, and User Auth (pages/).

🛠️ Technology Stack

Backend

Technology

Description

Node.js / Express

JavaScript runtime and fast, unopinionated web framework.

TypeScript

Statically typed superset of JavaScript for robust code.

MongoDB / Mongoose

NoSQL database and elegant object data modeling (ODM) for Node.js.

JWT & bcryptjs

Secure authentication using JSON Web Tokens and password hashing.

Frontend

Technology

Description

React

JavaScript library for building user interfaces.

Vite

Next-generation frontend tooling for a fast development experience.

TypeScript

Ensures type safety throughout the frontend application.

Tailwind CSS

Utility-first CSS framework for rapid styling.

Shadcn UI

Reusable, accessible UI components built on top of Radix UI.

bun

(Used for lock file bun.lockb) Fast package manager for dependency control.

⚙️ Getting Started

Prerequisites

You must have the following installed on your machine:

Node.js (v18+)

Git

A running MongoDB instance (Local or Atlas)

Setup Instructions

1. Clone the Repository

First, clone the project from GitHub and navigate into the root directory:

git clone <YOUR_REPO_URL>
cd AssetM


2. Backend Setup (backend/)

Navigate to the backend directory and install dependencies:

cd backend
npm install
# OR yarn install / bun install


Environment Variables (.env)

Create a file named .env in the backend/ directory and add your configuration. Do not commit this file to Git.

# backend/.env

JWT_SECRET="YOUR_OWN_VERY_STRONG_SECRET_KEY"
DATABASE_URL="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/fluid_asset_flow?retryWrites=true&w=majority"
PORT=5000
client_origin=http://localhost:8080 


3. Frontend Setup (frontend/)

Navigate to the frontend directory and install dependencies:

cd ../frontend
npm install
# OR bun install (since you have bun.lockb)


Environment Variables (Frontend)

Create a file named .env in the frontend/ directory to configure the API base URL.

# frontend/.env

# The base URL of your local backend server
VITE_API_BASE_URL="http://localhost:5000/api"


▶️ Running the Application

Start the Backend API

From the backend/ directory:

# Compile TypeScript and start the server with hot reload
npm run dev 


The backend API should be running on http://localhost:5000.

Start the Frontend Client

From the frontend/ directory:

# Start the Vite development server
npm run dev


The frontend application should open in your browser, typically at http://localhost:8080.