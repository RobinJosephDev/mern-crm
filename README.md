# MERN CRM Application

A full-stack **CRM (Customer Relationship Management)** application
built using the **MERN stack** with role-based access control, JWT
authentication, email queue system, dashboard analytics, and complete
CRUD functionality.

This system helps manage leads, generate quotes, convert customers,
manage shipments, and track follow-ups through a secure and responsive
UI.

------------------------------------------------------------------------

# 🚀 Tech Stack

## Frontend

-   React (TypeScript)
-   Tailwind CSS
-   React Router DOM
-   Axios (with interceptors)
-   Recharts (Dashboard charts)
-   JWT-based authentication
-   Password strength validation
-   Frontend input sanitization
-   Responsive UI

## Backend

-   Node.js
-   Express.js
-   MongoDB & Mongoose
-   JWT Authentication
-   bcrypt (password hashing)
-   Role-Based Access Control (RBAC)
-   Nodemailer (Email service)
-   Email queue system (Redis-based)
-   Background email worker
-   Multer (file uploads)
-   Centralized error handling

------------------------------------------------------------------------

# ✨ Core Features

# 🔐 Authentication & Authorization

-   User login & logout
-   JWT-based authentication
-   Role-Based Access Control (RBAC)
-   Remember Me functionality
-   Protected API routes
-   Automatic logout on token expiration

### Supported Roles

-   Admin
-   Employee
-   Carrier
-   Customer

------------------------------------------------------------------------

# 🔁 Remember Me Functionality

Users can choose between:

-   localStorage → Persistent login (Remember Me checked)
-   sessionStorage → Session-only login (cleared when browser closes)

Axios automatically attaches token from either storage.

------------------------------------------------------------------------

# 🔑 Forgot & Reset Password System

Secure password recovery flow:

1.  User requests reset link
2.  Token is generated and stored securely
3.  Reset email is sent via Nodemailer
4.  User sets new password
5.  Password strength validation enforced
6.  User is auto-logged in after successful reset

Includes:

-   Token expiration
-   Secure hashed reset tokens
-   Email queue processing
-   Spam protection improvements

------------------------------------------------------------------------

# 📧 Email System

The application includes a background email processing system.

### Features:

-   Welcome emails
-   Password reset emails
-   Lead assignment emails
-   Follow-up reminder emails

### Architecture:

-   Email templates (/emails/templates)
-   Email service layer
-   Email queue (Redis)
-   Background worker processor
-   Non-blocking API performance

------------------------------------------------------------------------

# 📊 Role-Based Dashboard

After login, users are redirected to a dynamic dashboard based on their
role.

The dashboard:

-   Fetches role-specific protected endpoints
-   Displays KPI statistic cards
-   Displays charts using Recharts
-   Automatically logs out on 401 Unauthorized
-   Redirects to login if no valid token

------------------------------------------------------------------------

## 📈 Dashboard Features by Role

### Admin

-   Total Leads
-   Pending Quotes
-   Active Shipments
-   Total Customers
-   Leads per Month (Bar Chart)
-   Shipment Status (Pie Chart)

### Employee

-   Assigned Leads
-   Pending Quotes
-   Leads per Month (Bar Chart)

### Carrier

-   Shipment Status Overview (Pie Chart)

### Customer

-   View assigned shipments
-   Track shipment progress

------------------------------------------------------------------------

# 📦 Lead, Quote & Shipment Management

Full CRUD operations for:

-   Leads
-   Follow-ups
-   Products
-   Quotes
-   Shipments

Includes:

-   Multiple contact persons per lead
-   Quote-to-shipment workflow
-   Follow-up tracking system

------------------------------------------------------------------------

# 🔐 Security & Validation

-   JWT Authentication
-   Role-protected API routes
-   Frontend form validation
-   Password strength validation
-   Backend schema validation
-   Centralized error handling
-   Sanitized user inputs

------------------------------------------------------------------------

## 📂 Project Structure

mern-crm/
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── redis.js              # Redis connection config
│   │
│   ├── controllers/
│   │   ├── authController.js     # Auth logic (login, register, reset password)
│   │   ├── leadController.js     # Lead CRUD logic
│   │   └── ...
│   │
│   ├── emails/
│   │   ├── email.service.js      # Central email sending service
│   │   ├── email.types.js        # Email type definitions
│   │   └── templates/
│   │       ├── welcome.template.js
│   │       ├── resetPassword.template.js
│   │       ├── followUpDue.template.js
│   │       └── leadAssigned.template.js
│   │
│   ├── jobs/
│   │   └── followUpReminder.job.js   # Scheduled background jobs
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection
│   │   └── roleMiddleware.js     # Role-based access control
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Lead.js
│   │   └── ...
│   │
│   ├── queues/
│   │   ├── email.queue.js        # Email queue config (Redis)
│   │   └── email.worker.js       # Background email processor
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── ...
│   │
│   ├── uploads/                  # File uploads storage
│   ├── server.js                 # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts          # Axios instance with JWT interceptor
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── leads/
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ...
│   │   │
│   │   ├── utils/
│   │   │   └── passwordStrength.ts
│   │   │
│   │   ├── types/
│   │   └── App.tsx
│   │
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md

------------------------------------------------------------------------

# 🌍 Deployment

-   Frontend: Vercel
-   Backend: Heroku
-   MongoDB Atlas
-   Environment-based API configuration

------------------------------------------------------------------------

# 🏆 Highlights

-   Full RBAC implementation
-   Background email queue system
-   Role-based dynamic dashboard
-   Remember Me login persistence
-   Secure password reset workflow
-   Production-ready architecture
-   Clean, modular folder structure
-   Scalable design

------------------------------------------------------------------------

# 📌 Conclusion

This MERN CRM system demonstrates:

-   Full-stack architecture
-   Secure authentication design
-   Role-based system modeling
-   Background job processing
-   Real-world business workflow logic
-   Scalable production-ready coding practices
