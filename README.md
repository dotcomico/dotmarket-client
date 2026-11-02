# 🛒 Dotmarket Frontend

The customer storefront and admin back office for **[Dotmarket](https://github.com/dotcomico/dotmarket)**, a full-stack supermarket e-commerce app.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/state-Zustand-443E38)

> [!NOTE]
> This is one of four repos that make up Dotmarket. For the overview, more screenshots and full setup, start with the **[main repo](https://github.com/dotcomico/dotmarket)**.

<p align="center">
  <img src="https://raw.githubusercontent.com/dotcomico/dotmarket/main/media/screenshots/hero-storefront.png" width="800" alt="Dotmarket storefront home page with a search bar, category tiles and a product grid">
</p>

## ✨ Features

**Customers**
- Browse products through a category tree, or search by name
- Switch between a photo and a 360° view on product pages that have one
- Add to cart, track progress toward free shipping, and check out
- View order history and profile details
- Use light or dark mode on any screen size

**Admins and managers**
- Dashboard with live stats and low-stock alerts
- Create, edit and delete products and categories
- Update order status
- Manage user roles

**AI chat assistant (optional)**
- A chat widget answers product questions using real store data. It needs the [AI server](https://github.com/dotcomico/dotmarket-ai-server) to be running.

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite 7 |
| Routing | React Router 7 |
| State | Zustand, with separate stores per domain |
| HTTP | Axios |
| Icons | lucide-react |
| Production server | nginx, in a Docker image |

## 🚀 Getting Started

**You need:**
- Node.js 20.19+ or 22.12+
- The [Dotmarket backend](https://github.com/dotcomico/dotmarket-server) running at `http://localhost:3000`

```bash
git clone https://github.com/dotcomico/dotmarket-client.git frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. No environment variables are needed.

### Test accounts

These exist once the backend database has been seeded. All passwords are `Test123!`.

| Role | Email | What you can see |
|---|---|---|
| Admin | `admin@test.com` | Everything, including user roles |
| Manager | `manager@test.com` | The admin area |
| Customer | `customer@test.com` | The storefront, with order history |

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Type-checks and builds for production into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## 🔌 How It Connects to the Other Services

The browser only ever calls this app's own address. The dev server and nginx forward each path to the right service:

| Path | Goes to | Used for |
|---|---|---|
| `/api` | Backend (port 3000) | Products, orders, login |
| `/uploads` | Backend (port 3000) | Product images |
| `/ai` | AI server (port 8100) | Chat widget |

The forwarding rules are in `vite.config.ts` for development and `nginx.conf` for production.

## 📁 Project Structure

```
src/
├── api/          # Shared Axios instance and endpoint list
├── components/   # Shared UI, layouts and admin chrome
├── features/     # One folder per domain: admin, auth, cart, categories,
│                 # chat, home, orders, products, profile
├── hooks/        # Hooks used across domains
├── pages/        # One component per route
├── routes/       # Route definitions and login/admin guards
├── store/        # App-wide Zustand stores: auth, cart, orders, UI
├── styles/       # Global styles
└── main.tsx      # Entry point
```

Each feature keeps its own API calls, components, hooks and types together. Finding everything about "cart" means opening one folder.

## 🐳 Docker

The production image has to run alongside the other services, because `nginx.conf` forwards requests to containers named `backend` and `ai-server`. To run it, use the Docker Compose setup in the [Quick Start](https://github.com/dotcomico/dotmarket/blob/main/docs/QUICK_START.md).

## 🔗 Related Repos

| Repo | Role |
|---|---|
| [`dotmarket`](https://github.com/dotcomico/dotmarket) | Overview, docs and Docker Compose |
| [`dotmarket-server`](https://github.com/dotcomico/dotmarket-server) | REST API, auth and database |
| [`dotmarket-mcp-server`](https://github.com/dotcomico/dotmarket-mcp-server) | Exposes the backend as tools for AI models |
| [`dotmarket-ai-server`](https://github.com/dotcomico/dotmarket-ai-server) | Chat assistant |

## 📄 License

[MIT](LICENSE)
