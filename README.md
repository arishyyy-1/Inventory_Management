# 📦 MERN Stack Inventory Management System

A full-stack inventory management application built with the **MERN stack** (MongoDB, Express.js, React, Node.js), developed as a **4-Week Progressive Assessment for Synexus Software Technologies – Full Stack Track**.

The project focuses on authentication, product management, category relationships, server-side filtering, pagination, validation, and product image handling.

---

## 🌟 Assessment Progress

### 🟢 Week 1 — Core CRUD & Project Setup

* Full-stack client/server architecture
* MongoDB integration using Mongoose
* Product CRUD operations
* Modular React component structure
* RESTful API implementation
* Immediate UI updates after product operations

### 🔵 Week 2 — Authentication & Protected Interfaces

* User registration and login
* JWT-based authentication
* Password hashing using `bcryptjs`
* Persistent authentication using `localStorage`
* Axios authentication handling
* Protected React routes
* Protected backend API routes using authentication middleware

### 🟣 Week 3 — Categories & Server-Side Querying

* Dedicated `Category` MongoDB collection
* Products reference categories using MongoDB `ObjectId`
* Mongoose `.populate()` for category data
* Server-side product filtering
* Category filtering
* Price range filtering
* Quantity and stock filtering
* Availability filtering
* Server-side search by product name, SKU, and description
* Debounced search
* Server-side sorting
* Pagination
* URL-based filters for shareable product searches

### 🟠 Week 4 — Product Image Uploads & File Handling

* Multipart form-data support using `multer`
* Product image upload during creation and editing
* Local image storage in `server/uploads/`
* Static image serving through Express
* Maximum file size of **10 MB**
* Supported image formats:

  * JPG
  * JPEG
  * PNG
  * GIF
  * WEBP
* SVG files are explicitly blocked
* Automatic deletion of old image files when an image is replaced
* Automatic image cleanup when a product is deleted
* Ability to remove an existing product image during editing
* Client-side image preview before submission

---

# ✨ Main Features

## Authentication

* Secure user registration and login
* JWT authentication
* Protected routes
* Persistent login sessions
* Password hashing with `bcryptjs`

## Dashboard

* Inventory overview with KPI cards
* Stock health information
* Products added over time
* Recent activity
* Clickable inventory statistics for product filtering

## Product Management

* Add products
* Edit products
* Delete products with confirmation
* View product catalog
* Product image upload
* Product image replacement
* Product image removal
* Instant UI updates after CRUD operations

## Search & Filtering

* Search by product name
* Search by SKU
* Search by description
* Category filtering
* Availability filtering
* Low-stock filtering
* Price range filtering
* Quantity range filtering
* Sorting
* Pagination
* URL-based filters

## User Experience

* Responsive modern SaaS interface
* Light and dark theme
* Animated page transitions
* Skeleton loading states
* Toast notifications
* Error messages
* Empty states
* Responsive navigation

## Validation & Error Handling

* Frontend form validation
* Backend request validation
* Image type validation
* Image size validation
* Centralized API error handling
* Meaningful success and error responses

---

# 🛠️ Tech Stack

## Frontend

* React 18
* Vite
* React Router DOM
* Tailwind CSS
* Framer Motion
* Axios
* React Hot Toast
* Lucide React

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* JSON Web Tokens (JWT)
* bcryptjs
* express-validator
* dotenv
* CORS

---

# 📁 Project Structure

```text
Inventory_Management/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProductTable.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
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
│   ├── uploads/
│   │   └── .gitkeep
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Environment Variables

## Server

Create a `.env` file inside the `server/` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

## Client

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> Do not commit real environment variables or secret keys to GitHub.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/arishyyy-1/Inventory_Management.git
cd Inventory_Management
```

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

Create `server/.env` and add the required environment variables.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## 3. Install Frontend Dependencies

Open a second terminal:

```bash
cd client
npm install
```

Create `client/.env` and configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on the Vite development server, typically:

```text
http://localhost:5173
```

---

# 📝 Seed Categories

Before creating products, make sure the database contains active categories.

Example category documents:

```json
[
  {
    "name": "office supplies",
    "description": "Paper, pens, and desk items",
    "isActive": true
  },
  {
    "name": "networking",
    "description": "Routers, switches, and cables",
    "isActive": true
  },
  {
    "name": "audio & video",
    "description": "Headsets, speakers, and monitors",
    "isActive": true
  },
  {
    "name": "storage devices",
    "description": "SSDs, HDDs, and flash drives",
    "isActive": true
  }
]
```

These can be added using MongoDB Compass or through the appropriate API endpoint.

---

# 📡 API Endpoints

## 🔐 Authentication

| Method | Endpoint             | Description                       | Access    |
| ------ | -------------------- | --------------------------------- | --------- |
| POST   | `/api/auth/register` | Register a new user               | Public    |
| POST   | `/api/auth/login`    | Authenticate user and receive JWT | Public    |
| GET    | `/api/auth/profile`  | Get logged-in user profile        | Protected |

## 🏷️ Categories

| Method | Endpoint          | Description           | Access    |
| ------ | ----------------- | --------------------- | --------- |
| GET    | `/api/categories` | Get active categories | Protected |

## 📦 Products

| Method | Endpoint            | Description                                                | Access    |
| ------ | ------------------- | ---------------------------------------------------------- | --------- |
| GET    | `/api/products`     | Get products with search, filters, sorting, and pagination | Protected |
| GET    | `/api/products/:id` | Get a single product                                       | Protected |
| POST   | `/api/products`     | Create a product with optional image upload                | Protected |
| PUT    | `/api/products/:id` | Update a product and optionally replace/remove image       | Protected |
| DELETE | `/api/products/:id` | Delete a product and its stored image                      | Protected |

---

# 🖼️ Image Handling

Product images are handled using `multer` and stored locally in:

```text
server/uploads/
```

Images are served statically by the Express server.

### Validation

* Maximum file size: **10 MB**
* Allowed formats: JPG, JPEG, PNG, GIF, WEBP
* SVG uploads are blocked

### File Cleanup

When an image is replaced or a product is deleted, the previous image file is removed from local storage to prevent orphaned files.

When editing a product, users can also remove the existing image without uploading a replacement.

---

# 🏗️ Architecture & Design Decisions

### Category Relationships

Categories are stored in a dedicated MongoDB collection rather than as raw strings inside products.

Products reference categories using MongoDB `ObjectId`, allowing structured relationships and Mongoose population.

### Local Image Storage

Local Multer storage was used for product images to satisfy the assessment requirements without introducing an external cloud-storage dependency.

### Structured Image Data

Product images are stored with information such as the image URL and filename, allowing the server to identify and remove the correct file during updates or deletion.

### Server-Side Querying

Search, filtering, sorting, and pagination are handled by the backend rather than loading the entire product dataset into the browser.

---

# 🖥️ Main Application Screens

* Login
* Register
* Dashboard
* Product Catalog
* Add Product
* Edit Product
* Product Details
* 404 / Not Found

---

# 🔑 Key Highlights

* MERN stack architecture
* JWT authentication
* Protected frontend and backend routes
* MongoDB/Mongoose integration
* Relational category references
* Server-side search and filtering
* Sorting and pagination
* Product image uploads
* Image replacement and removal
* Automatic local image cleanup
* Responsive UI
* Light and dark themes
* Animated transitions
* Form validation
* Centralized error handling

---

# 👩‍💻 Author

**Arisha Tariq**

BS Computer Science • MERN Stack Developer
