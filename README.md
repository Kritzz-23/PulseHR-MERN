# 🥇 PulseHR — Enterprise Employee Management & HRMS Platform (MERN Stack)

> **Production-grade Human Resource Management System (HRMS) engineered with MongoDB, Express.js, React, Node.js, and hierarchical Role-Based Access Control (RBAC).**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://kritzz-23.github.io/PulseHR-MERN/)
[![API Status](https://img.shields.io/badge/API-Express%20v4-blue?style=for-the-badge&logo=express)](https://github.com/Kritzz-23/PulseHR-MERN)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Mongoose-green?style=for-the-badge&logo=mongodb)](https://github.com/Kritzz-23/PulseHR-MERN)
[![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20RBAC-orange?style=for-the-badge&logo=jsonwebtokens)](https://github.com/Kritzz-23/PulseHR-MERN)

---

## 🌐 Live Interactive Application & Source Code

- **Live Web Application**: [https://kritzz-23.github.io/PulseHR-MERN/](https://kritzz-23.github.io/PulseHR-MERN/)
- **GitHub Repository**: [https://github.com/Kritzz-23/PulseHR-MERN](https://github.com/Kritzz-23/PulseHR-MERN)
- **Author**: **Kritika Giri** ([@Kritzz-23](https://github.com/Kritzz-23)) &bull; B.Tech CSE (AIML), Brainware University (CGPA 8.54)

---

## 🏢 Real-World Enterprise Scenario

Modern fast-scaling companies require a unified system to manage **Employees, Departments, Attendance, Leave, Tasks, Performance, Payroll, and Document Compliance**.

```
Admin (Superuser & Company Analytics)
   ↓
HR Lead (People Operations & Onboarding)
   ↓
Manager (Team Tasks & Leave Approvals)
   ↓
Employee (Self-Service Attendance & Leave)
```

Each tier in the hierarchy receives distinct, cryptographically-enforced permissions via **JSON Web Tokens (JWT)** and middleware guards.

---

## 📊 Live Executive HRMS Dashboard

| Metric | Real-time Value | Context |
|---|---|---|
| **Total Employees** | **245** | Scale across 5 core departments |
| **Present Today** | **218** | 89% Daily Attendance Velocity |
| **On Leave** | **17** | 7% Approved Absence Rate |
| **Pending Requests** | **10** | Awaiting Managerial Action |

### Interactive Visualizations
- **📈 Employee Growth Trajectory**: 12-month trajectory from 175 to 245 employees with hiring velocity data.
- **📊 Department Distribution**:
  - Engineering: **103** (42%)
  - Product & Design: **44** (18%)
  - Sales & Growth: **37** (15%)
  - Marketing: **37** (15%)
  - HR & Operations: **24** (10%)

---

## 🔑 Role-Based Access Control (RBAC) Matrix

| Feature / Capability | 👑 Admin | 💼 HR Lead | 👔 Manager | 👤 Employee |
|---|:---:|:---:|:---:|:---:|
| **Executive Company Analytics & Growth Charts** | ✅ Full Access | ✅ Full Access | 👥 Team Only | ❌ |
| **Add / Provision New Employees** | ✅ | ✅ | ❌ | ❌ |
| **Delete / Terminate Employee Records** | ✅ | ❌ | ❌ | ❌ |
| **Approve / Reject Leave Tickets** | ✅ | ✅ | ✅ Direct Reports | ❌ Apply Only |
| **1-Click Clock-In / Clock-Out Attendance** | ✅ | ✅ | ✅ | ✅ |
| **Assign & Delegate Departmental Tasks** | ✅ | ✅ | ✅ | ❌ Status Update |
| **View Personal Profile & Documents** | ✅ | ✅ | ✅ | ✅ |

---

## 🏗️ MERN Architecture & Tech Stack

```
   [ React.js Web Client ] 
              │  (Axios HTTP Client + JWT Interceptors)
              ▼
    [ Express.js Gateway ]
              │  (Helmet, CORS, Rate-Limiting, Morgan)
              ▼
   [ Node.js Controller Layer ]
              │  (bcryptjs Hashing + JWT Signatures + RBAC Guards)
              ▼
   [ MongoDB Relational Documents ]
                 ├── Users & Auth Credentials
                 ├── Employee Profiles (245 Records)
                 ├── Departments (ENG, PRD, SLS, MKT, HRO)
                 ├── Attendance Logs (Timestamped Clock In/Out)
                 ├── Leave Requests (Casual, Sick, Privilege)
                 └── Tasks & Milestones
```

---

## 🔌 Complete RESTful API Endpoints

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user & auto-provision employee profile |
| `POST` | `/api/auth/login` | Public | Authenticate with email/password & return signed JWT |
| `GET` | `/api/auth/me` | Private | Get authenticated user & employee record |
| `POST` | `/api/auth/forgotpassword` | Public | Request password reset email |

### 2. Employees (`/api/employees`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/employees` | Private | Get all employees (search, department filter, pagination) |
| `GET` | `/api/employees/:id` | Private | Get single employee details |
| `POST` | `/api/employees` | Admin / HR | Provision and onboard new employee |
| `PUT` | `/api/employees/:id` | Admin / HR | Update employee designation, salary, department |
| `DELETE` | `/api/employees/:id` | Admin Only | Remove employee from database |

### 3. Leave Management (`/api/leaves`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/leaves` | Private | Get leave requests (filtered by role) |
| `POST` | `/api/leaves` | Private | Submit leave request with dates & reason |
| `PUT` | `/api/leaves/:id/status` | Manager/HR/Admin | Approve or reject leave request |

### 4. Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/attendance/clock-in` | Private | Record shift start time and IP |
| `POST` | `/api/attendance/clock-out` | Private | Record shift completion time |
| `GET` | `/api/attendance/today` | Private | Retrieve today's attendance summary (218 Present) |

### 5. Tasks & Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Private | Get departmental task list |
| `POST` | `/api/tasks` | Manager/HR/Admin | Assign new task with due date & priority |
| `PUT` | `/api/tasks/:id/status` | Private | Update task status (Pending → In Progress → Completed) |
| `GET` | `/api/analytics/dashboard` | Private | Headcount metrics, growth trends, department breakdown |

---

## 💻 Local Setup & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Kritzz-23/PulseHR-MERN.git
cd PulseHR-MERN
```

### 2. Configure Environment Variables
Navigate into `server/` and create your `.env` configuration:
```bash
cd server
cp .env.example .env
```
Ensure your MongoDB connection string is configured in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/pulsehr_db
JWT_SECRET=super_secret_jwt_key_pulsehr_2026
JWT_EXPIRE=30d
```

### 3. Install Dependencies & Seed Database
```bash
npm install
npm run seed     # Populates 245 employees, departments, and demo accounts
```

### 4. Start the Express API Server
```bash
npm run dev      # Runs with nodemon on http://localhost:5000
```

### 5. Launch the Client Application
Open `index.html` in your browser or serve using:
```bash
npx serve .      # Runs live client on http://localhost:3000
```

---

## 👥 Demo Credentials for Evaluators

| Role | Email | Password | Pre-configured Access |
|---|---|---|---|
| 👑 **Admin** | `admin@pulsehr.io` | `Password@123` | Full system control, analytics, employee deletion |
| 💼 **HR Lead** | `hr@pulsehr.io` | `Password@123` | Onboarding, company-wide leave approvals |
| 👔 **Manager** | `manager@pulsehr.io` | `Password@123` | Team task delegation, leave triage |
| 👤 **Employee** | `employee@pulsehr.io` | `Password@123` | Clock-in/out, leave application, task execution |

*(Alternatively, use the 1-Click Role Switcher bar at the top of the live demo!)*

---

## 📜 License
Distributed under the MIT License. Built with ❤️ by [Kritika Giri](https://github.com/Kritzz-23).
