# MERN CRM Application

A full-stack **CRM (Customer Relationship Management)** application built using the **MERN stack** with role-based access control, JWT authentication, frontend sanitization, and complete CRUD functionality.

This project helps manage leads, assign them to employees, and track follow-ups through a clean and responsive UI.

---

## 🚀 Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- React Router DOM
- Axios
- Material UI (MUI)
- Google Maps Places API
- JWT-based authentication
- **Frontend input sanitization**
- Responsive UI

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt (password hashing)
- Role-Based Access Control (RBAC)
- Multer (file uploads)
- Nodemailer (email support)

---

## ✨ Features

## 🔐 Authentication & Authorization
- User registration, login, and logout
- JWT-based token authorization
- Role-Based Access Control (RBAC) with the following roles:
  - **Admin**
  - **Employee**
  - **Carrier**
  - **Customer**

---

## 👨‍💼 Admin Features
- Create, manage, and delete users:
  - Admins
  - Employees
  - Carriers
  - Customers
- View and manage all leads
- Assign leads to employees
- Convert quotes into customers
- View:
  - Leads with generated quotes
  - Shipments with associated quotes
- Full visibility across CRM, quoting, and shipment workflows

---

## 👷 Employee Features
- View and manage assigned leads
- Edit leads and contact details
- Add and manage follow-ups
- Generate quotes for leads
- Update lead status and activity history

---

## 🚚 Carrier Features
- Create and manage shipments
- View shipments assigned to them
- Manage shipment details:
  - Status updates
  - Delivery information
- View shipment-related quotes
- Track shipment progress

---

## 👤 Customer Features
- View assigned shipments
- Track shipment status
- View shipment-related quote details
- Read-only access to ensure data integrity

---

## 📊 Lead, Quote & Shipment Management
- Full CRUD operations for:
  - Leads
  - Follow-ups
  - Products
  - Quotes
  - Shipments
- Multiple contact persons per lead
- Quote-to-shipment workflow
- Follow-up tracking system

---

## ✅ Validation, Sanitization & Security
- Frontend form validation
- **Frontend input sanitization**
- Backend schema validation
- Secure role-protected API endpoints
- Centralized error handling

---

## 📸 Screenshot

![Screenshot (153)](https://github.com/user-attachments/assets/def5e997-7cca-484b-b975-cc7b5d9b8470)

---

## 📂 Project Structure

```bash
mern-crm/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── types/
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
