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

### 🔐 Authentication & Authorization
- User registration, login, and logout
- JWT-based token authorization
- Role-based access control:
  - **Admin**
  - **Employee**

---

### 👨‍💼 Admin Features
- Create and manage employees
- Assign leads to employees
- View and manage all leads
- Full CRUD operations
- Protected admin-only routes

---

### 👷 Employee Features
- View assigned leads
- Edit leads
- Add and manage follow-ups
- Manage products and contact persons

---

### 📊 Lead & Follow-Up Management
- Full CRUD operations
- Add, edit, view, and delete:
  - Leads
  - Follow-ups
  - Products
  - Multiple contact persons
- Follow-up tracking system

---

### 📋 Tables & UI
- Searching, sorting, and filtering
- Modal popups for:
  - Add
  - Edit
  - Delete confirmation
- Clean and user-friendly UI

---

### ✅ Validation, Sanitization & Security
- Frontend form validation
- **Frontend input sanitization**
- Backend schema validation
- Secure API endpoints
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
