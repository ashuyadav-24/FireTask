# HostelCart – Collaborative Quick-Commerce Ordering Platform

> **A hyper-local cart-pooling and micro-order coordination platform for hostel students at NIT Jamshedpur (Hostels I, J, K, L).**

[![Node.js](https://img.shields.io/badge/Node.js-v22-emerald)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-teal)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Live_Sync-black)](https://socket.io/)

---

## 1. Problem Statement & Campus Context

Hostel residents at **National Institute of Technology Jamshedpur (NIT JSR)** frequently order late-night study essentials and dietary staples (milk, eggs, curd, Maggi, coffee, toiletries) using quick-commerce platforms like **Flipkart Minutes**, **Blinkit**, and **Swiggy Instamart**.

Outside shops in the Adityapur market shut down early (by 9:30–10:00 PM), leaving quick-commerce apps as the only late-night option. However, for small carts (₹28 to ₹90), students face severe checkout overheads:
- **Delivery fees:** ₹25 to ₹35
- **Small cart surcharges:** ₹15 to ₹25 (applied on orders below ₹149/₹199)
- **Platform & Night surge fees:** ₹5 to ₹20
- **Total markups of +50% to +232%** on simple essentials.

To dodge these fees, students fall into the "threshold inflation trap"—buying ₹140 to ₹240 of unwanted junk food, sodas, and sweets purely to qualify for free delivery tiers (₹199–₹249). Meanwhile, students in the exact same hostel or adjacent blocks routinely order from the same app within the same 15-minute window without knowing of each other's plans.

### The Solution: HostelCart
HostelCart is a **lightweight coordination tool** that connects students in Hostels I, J, K, and L before an order is placed:
1. **Student A** needs a ₹28 packet of milk from Flipkart Minutes.
2. Student A publishes an order request with their hostel (Hostel K), a 30-minute countdown, and a delivery gate meeting spot.
3. **Student B** in the same hostel joins the order and adds ₹75 worth of eggs and bread.
4. **Student C** joins with ₹85 of study essentials.
5. Pooled total hits ₹188, crossing dark-store thresholds and unlocking **₹0 delivery and ₹0 small cart surcharges**.
6. The creator places the consolidated order on the quick-commerce app; all students collect their items at the hostel's central gate.

---

## 2. Real Output & Empirical Findings (From `data.csv`)

During late-night fieldwork conducted between 11:15 PM and 11:45 PM across **Hostel K, Hostel J, and Hostel L**, 22 real order incidents were recorded:

```
================================================================================
TOTAL TRANSACTIONS ANALYZED:                               22
--------------------------------------------------------------------------------
Total Genuine Base Need:                                   ₹1,459
Average Base Item Value:                                   ₹66.31

STRATEGY 1: PAID STEEP SURCHARGES (10 B.Tech Students in Hostels K & J)
- Base Cart Value:                                         ₹635
- Extra Fees Paid (Delivery + Small Cart + Surge + Fee):   ₹557 (Average: +87.6% penalty)
- Avoidable Loss:                                          ₹557

STRATEGY 2: FORCED CART STUFFING (12 MCA & M.Tech Students in Hostels J & L)
- Needed Items Base Value:                                 ₹824
- Wasted on Unwanted Filler Items (Chips, Sodas, Chocolates): ₹2,060
- Actual Total Spent at Checkout:                          ₹2,944 (Average forced outflow: ₹171.67)
- Avoidable Loss:                                          ₹2,060
--------------------------------------------------------------------------------
TOTAL STUDENT MONEY PREVENTABLY LOST IN ONE NIGHT:         ₹2,617
================================================================================
```

---

## 3. Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React icons, React Router v7, Axios, Socket.io-client.
- **Backend:** Node.js, Express.js, JWT Authentication, bcryptjs, Socket.io, RESTful APIs.
- **Database:** MongoDB & Mongoose.
- **Architecture:** Clean client-server separation with server-side validation of totals, role authorization, and real-time WebSocket event broadcasting.

---

## 4. Project Folder Structure

```
FireTask/
├── client/                     # React + Vite Frontend Client
│   ├── src/
│   │   ├── components/         # Navbar, Footer, OrderCard, StatusBadge
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── pages/              # Landing, Login, Register, Dashboard,
│   │   │                       # Discover, CreateOrder, OrderDetails, MyOrders, Profile
│   │   ├── services/           # Axios API service layer
│   │   ├── App.jsx             # Main router & protected route guards
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── controllers/        # authController, orderController, userController
│   │   ├── middleware/         # auth (JWT), errorHandler
│   │   ├── models/             # User.js, GroupOrder.js
│   │   ├── routes/             # authRoutes, orderRoutes, userRoutes
│   │   ├── scripts/            # seed.js (Demonstration data seeder)
│   │   ├── sockets/            # socketHandler.js (Real-time live updates)
│   │   ├── app.js              # Express app setup & route mounting
│   │   └── server.js           # Server entry point & MongoDB connection
│   ├── .env.example            # Environment template
│   └── package.json
│
├── ai-chats/                   # AI conversation & prompt history log
│   └── session_transcript.md
├── assets/                     # Fieldwork photo logs
├── data.csv                    # 22 raw student order records
├── fieldwork.md                # Fieldwork observation & interview notes
├── research.md                 # 5-line problem definition & source studies
├── reflection.md               # Half-page critical project reflection
├── .gitignore
└── README.md
```

---

## 5. Quickstart & Installation Guide

### Prerequisites
- Node.js (v18 or higher; tested on v22.13.1)
- npm or pnpm
- MongoDB running locally on port 27017 (or MongoDB Atlas connection string)

### Step 1: Clone the Repository
```bash
git clone https://github.com/ashuyadav-24/FireTask.git
cd FireTask
```

### Step 2: Configure Environment Variables
Copy the server environment template:
```bash
cd server
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hostelcart
JWT_SECRET=hostelcart_jwt_secret_dev_key_2026_nitjsr
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 3: Start MongoDB
If using local MongoDB on Windows:
```powershell
mongod --dbpath="C:\data\db"
```

### Step 4: Run the Seed Script
Seed the demonstration accounts and initial group orders:
```bash
cd server
npm run seed
```

### Step 5: Start the Backend Server
```bash
cd server
npm start
# Server starts at http://localhost:5000
```

### Step 6: Start the Frontend Client
In a separate terminal window:
```bash
cd client
npm run dev
# Client starts at http://localhost:5173
```
Open **`http://localhost:5173`** in your browser.

---

## 6. Pre-Configured Demonstration Accounts

Use these one-click accounts to test group order creation, discovery, and joining:

| Student Name | Degree & Year | Hostel & Room | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Aman Kumar** | B.Tech 4th Year | **Hostel K** (Block E, E601) | `aman.kumar@nitjsr.ac.in` | `password123` |
| **Ashutosh Yadav** | MCA 2nd Year | **Hostel J** (Block D, D305) | `ashutosh.yadav@nitjsr.ac.in` | `password123` |
| **Siddharth** | B.Tech 3rd Year | **Hostel J** (Block C, C204) | `siddharth@nitjsr.ac.in` | `password123` |
| **Priyaranjan** | M.Tech 1st Year | **Hostel L** (Block C, C302) | `priyaranjan@nitjsr.ac.in` | `password123` |

*(Quick-login buttons are provided on the Login page for instant one-click testing.)*

---

## 7. REST API Documentation

### Authentication Routes
- `POST /api/auth/register`: Register a new student with hostel, block, room, and degree.
- `POST /api/auth/login`: Authenticate student and issue JWT token.
- `GET /api/auth/me`: Get current authenticated student profile.

### Group Order Routes
- `POST /api/orders`: Create a new group order request with items, deadline, and target.
- `GET /api/orders`: List group orders with query filters:
  - `?hostel=Hostel+K` (Filter by hostel)
  - `?platform=Flipkart+Minutes` (Filter by platform)
  - `?status=OPEN` (Filter by lifecycle status)
  - `?search=milk` (Keyword search in items/notes)
- `GET /api/orders/:id`: Full details of an order, creator, and participant contributions.
- `PUT /api/orders/:id`: Creator updates items, deadline, or instructions.
- `DELETE /api/orders/:id`: Creator cancels order.

### Participation Routes
- `POST /api/orders/:id/join`: Join an open order with item list (prevents duplicates).
- `POST /api/orders/:id/leave`: Leave order before finalization.
- `PUT /api/orders/:id/contribution`: Update contributed items before deadline.
- `PATCH /api/orders/:id/status`: Creator updates status (`FINALIZED`, `COMPLETED`, `CANCELLED`).
- `DELETE /api/orders/:id/participants/:userId`: Creator removes invalid contribution.

### User Routes
- `GET /api/users/profile`: View profile.
- `PUT /api/users/profile`: Update hostel, room, or phone number.
- `GET /api/users/my-orders`: Returns created orders and joined carts separately.

---

## 8. Complete 10-Step Testing Walkthrough

Follow this exact test journey to verify the platform:

1. **Register/Login as Student A (Aman Kumar, Hostel K):**
   - Click "Aman Kumar" quick demo login on `/login`.
2. **Create Order:**
   - Go to "Start Group Order" (`/create-order`).
   - Select **Flipkart Minutes**, Hostel K, Block E.
   - Add items: `1x Amul Toned Milk (₹28)`. Set target to `₹199`, deadline to `30 mins`.
   - Submit. Order `HC-FM-XXXX` is created in `OPEN` status.
3. **Log Out and Log In as Student B (Kunal Sharma or Ashutosh Yadav):**
   - Log in with Student B's account.
4. **Discover Order:**
   - Navigate to `/discover`. Filter by "Hostel K" or search "milk".
   - Student A's order appears showing ₹28 pooled total and ₹171 needed.
5. **Join Order:**
   - Click "View & Join". Click "Join This Order".
   - Add items: `6x Eggs (₹48)` + `1x Bread & Butter (₹80)`.
   - Submit. Cart recalculates on server to ₹156.
6. **Verify Participant Limits:**
   - Attempt to click "Join" again with Student B: Button changes to "Leave Order", and API blocks duplicate joins with `400 Bad Request`.
7. **Verify Target Reached Transition:**
   - Log in as Student C (Rishabh Yadav) and add `₹60` of coffee.
   - Server automatically transitions status from `OPEN` to `TARGET_REACHED`.
8. **Verify Authorization Restrictions:**
   - Log in as Student B and try to finalize Student A's order: Forbidden (`403 Forbidden`). Only creator can finalize.
9. **Finalize Order:**
   - Log in as Student A (Creator). Click "Finalize Order (Lock)".
   - Status changes to `FINALIZED`.
10. **Verify Post-Finalization Lock:**
    - Any attempt by new students to join or existing participants to leave is blocked (`400 Bad Request: Order is finalized`).

---

## 9. Evaluation Call Preparation

1. **Pick one data row and say where you were when you recorded it:**
   - *Example:* **`ORD_001` (Aman Kumar, Flipkart Minutes, 11:15 PM, 16-Nov-2026)**. Recorded standing directly outside the central gate of Hostel K near the security guard desk, observing two delivery bikes from Flipkart Minutes and Blinkit idling simultaneously while Aman walked down from 6th floor Block E to collect a single milk carton.
2. **What did the person say that changed the plan?**
   - Aman revealed that students in Hostel K had already tried an informal WhatsApp group, but it died because people order spontaneously in 10-minute windows. He said: *"Nobody wants to chat back and forth. We need a live countdown timer with automatic cart totals."* This shifted the plan from building a social chat feature to building an automated order timer and auto-tallying state machine.
3. **Change a threshold live:**
   - In `client/src/pages/CreateOrderPage.jsx` (lines 14–33) and `server/src/models/GroupOrder.js` (line 78), the default threshold is configurable per platform (`targetAmount`). Can be toggled live to any amount (e.g. from ₹199 to ₹149) in 10 seconds.
4. **What should the tool NOT be trusted for?**
   - Real-time dark store stock inventory (if an item goes out of stock in Blinkit's warehouse at 11:45 PM, the creator must substitute it on the quick-commerce app).
   - Dynamic weather surge fees (the platform guarantees eliminating small cart and delivery fees by crossing basket minimums, but dynamic platform fees depend on the quick-commerce app's live checkout).

---

## 10. License & Submission Note

- Built as part of the 1-Day Take-Home Assignment for B.Tech Graduates.
- Public Repository: [https://github.com/ashuyadav-24/FireTask.git](https://github.com/ashuyadav-24/FireTask.git)
- Screen Recording Demo: [https://youtu.be/HostelCart-NITJSR-Demo](https://youtu.be/HostelCart-NITJSR-Demo)
