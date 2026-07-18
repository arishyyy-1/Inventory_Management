# Inventory Management System

A production-ready MERN Inventory Management System built for the Synexus Full Stack Internship Evaluation Week 1 milestone. The app provides end-to-end setup and core CRUD integration for product inventory using React, Vite, Express, MongoDB Atlas, and Mongoose.

## Features

- Add, view, edit, and delete products
- Responsive React interface with dashboard and product catalog pages
- Immediate UI updates after CRUD actions without page refreshes
- Delete confirmation modal
- Loading, empty, success, and error states
- Frontend validation for required fields, quantity, and price
- Backend request validation with meaningful error responses
- Centralized backend error handling
- Clean controller, route, model, middleware, service, and component separation
- Environment-variable based configuration

## Tech Stack

### Frontend

- React + Vite
- React Router DOM
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors
- helmet
- morgan
- express-validator

## Folder Structure

```text
inventory-management/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
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
├── .gitignore
└── README.md
```

## Installation Steps

1. Clone or open the project folder.
2. Install backend dependencies.
3. Install frontend dependencies.
4. Create `.env` files from the provided examples.
5. Add a valid MongoDB Atlas connection string.
6. Run the backend and frontend development servers.

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Setup

1. Create a MongoDB Atlas account.
2. Create a new cluster.
3. Create a database user with username and password.
4. Add your current IP address to the Atlas network access list.
5. Copy the connection string.
6. Replace `your_mongodb_connection_string` in `server/.env`.

Example connection string format:

```text
mongodb+srv://<username>:<password>@<cluster-url>/inventory-management?retryWrites=true&w=majority
```

## Running Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on the port defined by `PORT`.

## Running Frontend

```bash
cd client
npm install
npm run dev
```

The frontend is served by Vite and reads the backend URL from `VITE_API_URL`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API health |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a single product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

## Product Fields

- `productName` - required string
- `sku` - required unique string
- `category` - required string
- `quantity` - required number, cannot be negative
- `price` - required number, cannot be negative
- `description` - optional string
- `createdAt` - generated timestamp
- `updatedAt` - generated timestamp

## Future Improvements

- Authentication and role-based access control
- Product search, filtering, and pagination
- CSV import and export
- Stock movement history
- Low-stock email alerts
- Unit and integration tests
- Docker development setup
