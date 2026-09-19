# ☕ Vibes Café - Full Stack Digital Platform

Welcome to the **Vibes Café Digital Experience**. This repository contains a complete, dual-website web application featuring the public Customer Website, Barista Kitchen Display System (KDS), Owner/Admin Executive Hub, and a live Reviews & Complaints Portal.

---

## 🌟 Architecture & Highlights

The repository hosts **two separate websites** powered by a single Express & SQLite backend with real-time Server-Sent Events (SSE):

1. **☕ Customer Website** (`http://localhost:3000`)
   - 100% guest experience with zero admin or staff buttons.
   - Includes Home, Menu & Ordering, About, Branches, Gallery, Contact, and Reviews & Complaints.
2. **🛡️ Staff & Admin Operations Website** (`http://localhost:3001`)
   - Dedicated internal portal with role selection landing page.
   - Kitchen Display System (KDS) for Baristas & Executive Management Hub for Owners/Admins.
   - Enforced role security and distinct passwords for Baristas and Admins.

---

## 🚀 Quick Setup & Run

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)

### 1-Click Launch (Windows)
Double-click **`start.bat`**

### Manual Command Line Launch
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/vibes-cafe-digital-experience.git
cd vibes-cafe-digital-experience

# 2. Install dependencies
npm install

# 3. (Optional) Seed SQLite Database
node server/seed.js

# 4. Start the dual website server
node server/app.js
```


---

## 🔑 Staff Passwords & Roles

| Role | Email / ID | Password | Portal |
| :--- | :--- | :--- | :--- |
| **☕ Barista Staff** | `barista@vibescafe.com` | `barista@shift2026` | Kitchen Display System only |
| **👑 Owner / Admin** | `admin@vibescafe.com` | `admin@secure2026` | Full Management Hub only |

---

## 📤 How to Push This Repository to GitHub

Execute the following commands in your command prompt or terminal inside this project directory:

```bash
# 1. Initialize Git (if not already initialized)
git init

# 2. Add all files to Git
git add .

# 3. Commit the changes
git commit -m "Initial commit: Complete Vibes Cafe Dual-Website Platform"

# 4. Rename main branch
git branch -M main

# 5. Link your GitHub remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📁 Repository Structure

```
├── home_vibes_caf/             # Public Home page
├── menu_vibes_caf/             # Menu catalog & interactive cart drawer
├── about_vibes_caf/            # Café story, founder & artisan team profiles
├── branches_vibes_caf/         # Location listings & table reservation modal
├── gallery_vibes_caf/          # Filterable photo gallery
├── contact_vibes_caf/          # Contact form & inbox submission
├── reviews_vibes_caf/          # Reviews & Complaints submission & live feed
├── login_vibes_caf/            # Staff portal landing & role verification
├── worker_dashboard_vibes_caf/ # Barista Kitchen Display System (KDS)
├── admin_dashboard_vibes_caf/  # Owner & Admin executive dashboard
│
├── public/js/shared.js         # Shared cart, toast, modal & SSE utilities
├── server/                     # Express.js server & SQLite database
│   ├── app.js                  # Main server & dual-website routing
│   ├── db.js                   # Database schema & SQLite helper
│   ├── seed.js                 # Database seed generator
│   └── routes/                 # REST API endpoints & SSE broadcaster
│
├── .gitignore                  # Git ignore definitions
├── package.json                # Project dependencies
├── start.bat                   # 1-Click Windows launcher script
└── README.md                   # Repository documentation
```
