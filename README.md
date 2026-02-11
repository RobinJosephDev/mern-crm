# MERN CRM Application

A full-stack **CRM (Customer Relationship Management)** application built using the **MERN stack** with:

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (RBAC)
- 📧 Email functionality (Forgot Password & Notifications)
- 🧠 Remember Me authentication
- 🛡 Frontend & Backend validation & sanitization
- 📦 Quote-to-Shipment workflow
- 📊 Full CRUD operations

This CRM helps manage leads, users, quotes, shipments, and follow-ups through a clean and responsive UI.

---

# 🚀 Tech Stack

## 🖥 Frontend
- React (TypeScript)
- Tailwind CSS
- React Router DOM
- Axios (with interceptors)
- Material UI (MUI)
- JWT Decode
- Google Maps Places API
- Form validation & sanitization
- Responsive UI

## 🧠 Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt (password hashing)
- Role-Based Access Control (RBAC)
- Multer (file uploads)
- Nodemailer / SendGrid (Email service)
- Background Jobs & Queues
- Centralized error handling

---

# 🔐 Authentication & Authorization

- User Registration
- Login / Logout
- JWT-based authentication
- Protected API routes
- Role-based authorization
- Remember Me functionality

## 👤 User Roles

- **Admin**
- **Employee**
- **Carrier**
- **Customer**

Each role has strictly controlled access to routes and features.

---

# 🧠 Remember Me Functionality

The application supports two login persistence modes:

### ✅ If "Remember Me" is checked:
- JWT is stored in `localStorage`
- User remains logged in after closing the browser

### ✅ If "Remember Me" is NOT checked:
- JWT is stored in `sessionStorage`
- Token is cleared when browser is closed

Axios automatically reads the token from:
- `localStorage`
- or `sessionStorage`

This ensures secure and flexible authentication handling.

---

# 📧 Email Functionality

The application includes secure email workflows.

## 🔑 Forgot Password Flow

1. User submits email.
2. Backend generates a secure reset token.
3. Reset link is emailed to the user.
4. Token has expiration time.
5. User resets password securely.

## 📬 Email Service

- Uses **Nodemailer** (development)
- Supports **SendGrid** (production)
- Email templates stored inside:
  ```
  backend/emails/
  ```
- Background email processing supported via:
  ```
  backend/jobs/
  backend/queues/
  ```

---

# 👨‍💼 Admin Features

- Create, manage, delete:
  - Admins
  - Employees
  - Carriers
  - Customers
- View all leads
- Assign leads to employees
- Convert quotes into customers
- View:
  - Leads with quotes
  - Shipments with quotes
- Full CRM visibility

---

# 👷 Employee Features

- Manage assigned leads
- Edit leads & contacts
- Add follow-ups
- Generate quotes
- Update lead status
- View activity history

---

# 🚚 Carrier Features

- Create shipments
- Manage shipment status
- View shipment quotes
- Track shipment progress

---

# 👤 Customer Features

- View assigned shipments
- Track shipment status
- View shipment quote details
- Read-only access

---

# 📊 Lead, Quote & Shipment Management

Full CRUD operations for:

- Leads
- Follow-ups
- Products
- Quotes
- Shipments
- Users

Includes:
- Multiple contact persons per lead
- Quote-to-shipment workflow
- Status tracking
- Pagination support

---

# 🛡 Security & Validation

- Frontend form validation
- Frontend input sanitization
- Backend schema validation
- JWT verification middleware
- Role-based route protection
- Secure password hashing (bcrypt)
- Protected file uploads
- Centralized error handling

---

# 📂 Updated Project Structure

```
mern-crm/
│
├── backend/
│   ├── config/            # Database & environment configuration
│   ├── controllers/       # Business logic
│   ├── emails/            # Email templates & mail service
│   ├── jobs/              # Background job handlers
│   ├── queues/            # Queue management
│   ├── middleware/        # Auth & role middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── build/
│   ├── public/
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Environment Variables

## Backend (.env)

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
SENDGRID_API_KEY=your_sendgrid_key
CLIENT_URL=http://localhost:3000
```

## Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

# 🏗 Deployment

Frontend:
- Vercel

Backend:
- Heroku / Render

Database:
- MongoDB Atlas

---

# 📸 Screenshot

![CRM Screenshot](https://github.com/user-attachments/assets/5ec8d269-a9d9-4b97-8182-9b8c4ab36462)

---

# 🎯 Future Improvements

- Refresh token implementation
- Email queue optimization
- Admin analytics dashboard
- Activity logging
- Audit trail system
- WebSocket real-time notifications

---

# 📄 License

This project is built for educational and portfolio purposes.
