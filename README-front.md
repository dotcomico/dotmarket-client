# 🛒 Supermarket Frontend

React + TypeScript frontend for the Supermarket e-commerce application.

## 🚀 Quick Start

### Run with Docker
```bash
docker pull dotcoms/supermarket-frontend:latest
docker run -p 80:80 dotcoms/supermarket-frontend:latest
```

### Run Locally
```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

> **Note:** Backend must be running at http://localhost:3000

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- React Router 7
- Zustand (State Management)
- Axios

## ✨ Features

### Customer
- Browse products by category
- Search products
- Add to cart
- Checkout
- Order history
- User profile

### Admin
- Dashboard with stats
- Product management (CRUD)
- Category management
- Order management
- User management

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/           # Axios config
│   ├── components/
│   │   ├── layouts/   # Header, Footer, Sidebar
│   │   └── ui/        # Button, Card, Input
│   ├── features/
│   │   ├── admin/     # Admin dashboard
│   │   ├── auth/      # Login, Register
│   │   ├── cart/      # Shopping cart
│   │   ├── orders/    # Orders
│   │   └── products/  # Product catalog
│   ├── hooks/         # Custom hooks
│   ├── models/        # TypeScript types
│   ├── pages/         # Page components
│   ├── routes/        # Router config
│   ├── store/         # Zustand stores
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run ESLint
```

## 🐳 Docker

```bash
# Build
docker build -t supermarket-frontend .

# Run
docker run -p 80:80 supermarket-frontend
```

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | Test123! |
| Manager | manager@test.com | Test123! |
| Customer | customer@test.com | Test123! |
