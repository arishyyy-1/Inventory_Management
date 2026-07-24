# InventoryPro – MERN Inventory Management System

A modern, production-ready Inventory Management System built with the MERN stack. The application provides secure authentication, inventory analytics, advanced product management, responsive UI, and an elegant light/dark theme inspired by modern SaaS products.

---

## Features

### Authentication

- Secure user registration and login
- JWT-based authentication
- Protected routes
- Persistent user sessions

### Dashboard

- Inventory overview with KPI cards
- Interactive Stock Health widget
- Products Added Per Day chart
- Recent Activity timeline
- Clickable stock statistics that automatically filter the Products page

### Product Management

- Add new products
- Edit existing products
- Delete products with confirmation modal
- View detailed product catalog
- Instant UI updates after CRUD operations

### Search & Filtering

- Search products by name or SKU
- Filter by category
- Filter by availability
- Low Stock filtering
- Price range filtering
- Quantity range filtering
- Sorting
- Pagination
- URL-based filters for shareable searches

### User Experience

- Beautiful modern SaaS interface
- Responsive design
- Light & Dark mode
- Animated page transitions
- Skeleton loading states
- Success and error notifications
- Empty state screens
- Responsive navigation

### Validation & Error Handling

- Frontend form validation
- Backend request validation
- Centralized error handling
- Meaningful API responses

---

# Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios
- React Hot Toast
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- express-validator
- dotenv
- cors
- helmet
- morgan

---

# Folder Structure

```text
inventory-management/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project

```bash
cd inventory-management
```

Install backend dependencies

```bash
cd server
npm install
```

Install frontend dependencies

```bash
cd ../client
npm install
```

---

# Environment Variables

### Server (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Running the Project

## Backend

```bash
cd server
npm run dev
```

Runs on

```
http://localhost:5000
```

---

## Frontend

```bash
cd client
npm run dev
```

Runs on

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |

---

## Products

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/products | Get products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

---

## Health

| Method | Endpoint |
|---------|----------|
| GET | /api/health |

---

# Product Schema

| Field | Type |
|--------|------|
| productName | String |
| sku | String (Unique) |
| category | String |
| quantity | Number |
| price | Number |
| description | String |
| createdAt | Date |
| updatedAt | Date |

---

# Screens

- Login
- Register
- Dashboard
- Product Catalog
- Add Product
- Edit Product
- 404 Page

---

# Highlights

- JWT Authentication
- Protected Routes
- Interactive Dashboard
- Inventory KPIs
- Search & Advanced Filtering
- Pagination
- Responsive Design
- Light & Dark Theme
- Animated UI
- Modern SaaS Design
- Clean Architecture
- RESTful API

---

# Future Improvements

- Role-based access control (Admin/User)
- Product image uploads
- Inventory transaction history
- CSV/Excel import & export
- Email notifications for low stock
- Sales and order management
- Unit & integration testing
- Docker support
- CI/CD pipeline

---

# Author

**Arisha Tariq**

BS Computer Science • MERN Stack Developer