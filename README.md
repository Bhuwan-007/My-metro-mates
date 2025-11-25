# 🚇 My Metro Mates

**My Metro Mates** is a hyper-local social networking PWA (Progressive Web App) designed to help university students find safe and compatible commute partners based on their daily metro route.

Built with **Next.js 15** and **MongoDB**, it features a custom graph-based matching algorithm, strict institutional verification, and a real-time status system.

---

## 🌟 Key Features

### 🔐 Institutional Security (The Gatekeeper)
- **Strict Domain Locking:** Authentication is restricted to specific university email domains (e.g., `@ipu.ac.in`).
- **Manual Verification Flow:** Students without official emails can upload their ID Card via a secure portal.
- **Admin Dashboard:** A hidden, secured route for admins to review and approve/reject ID submissions.

### 🧠 Intelligent Route Matching
- **Station Overlap Algorithm:** The search engine doesn't just match destinations. It calculates the **mathematical overlap** between two users' routes to ensure they travel together for at least 4+ stations.
- **Live Status:** Users can set a temporary "Today's Time" (e.g., "Running late, 11:00 AM") which overrides their standard schedule for 24 hours.
- **Smart Filters:** Filter matches by **Time Window** (+/- 60 mins) and **Gender** for safety.

### 🤝 The Connection Loop
- **Double-Blind Requests:** Users send connection requests which must be accepted to reveal contact info.
- **Privacy First:** WhatsApp/Instagram handles are encrypted and only revealed to accepted "Mates."
- **Persistent State:** Smart button logic handles all states (Connect -> Pending -> Accept -> Companion).

### 📱 PWA & Native Feel
- **Installable:** Fully PWA-compliant with Service Workers (Serwist). Works offline and installs on iOS/Android home screens.
- **Native UI:** Bottom dock navigation, haptic-style feedback, and "Midnight Glass" aesthetic designed for mobile-first usage.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Language:** TypeScript
- **Database:** MongoDB (Atlas) + Mongoose (ODM)
- **Auth:** Clerk (Custom Middleware protection)
- **Storage:** UploadThing (For ID Card verification)
- **Styling:** Tailwind CSS + Custom Animations
- **PWA:** @serwist/next

---

## 📂 Project Structure

```bash
├── actions/          # Server Actions (Backend Logic)
│   ├── user.action.ts    # Profile & Search algorithms
│   ├── request.action.ts # Friend Request logic
│   └── status.action.ts  # Daily status updates
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Clerk Login pages
│   ├── admin/        # Secure Admin Dashboard
│   ├── dashboard/    # User Home
│   ├── search/       # Discovery Engine
│   └── mates/        # Inbox & Connections
├── components/       # Reusable UI Components
│   ├── ConnectButton.tsx # Smart State Button
│   ├── StatusWidget.tsx  # Live Time Picker
│   └── SecurityGate.tsx  # Auth Middleware UI wrapper
├── lib/              # Utilities
│   ├── db.ts         # Cached MongoDB Connection
│   ├── metroData.ts  # Static Station Data & Indexes
│   └── models/       # Mongoose Schemas
└── public/           # PWA Assets