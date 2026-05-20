# MealHop - Food Delivery Platform

A full-stack food delivery application with customer ordering, restaurant management, and delivery tracking.

## Tech Stack

- **Frontend**: Astro + React + Tailwind CSS
- **Backend**: Express.js + MongoDB (Mongoose)
- **Auth**: JWT with HTTP-only cookies
- **Payment**: Stripe (optional, works in mock mode)

## Quick Start (Development)

### 1. Backend
```bash
cd Backend
npm install
# Edit .env with your MongoDB URL and JWT secret
npm run dev
```

### 2. Frontend
```bash
cd frontend-new
npm install
npm run dev
```

### 3. Seed Database (first time only)
```bash
cd Backend
npm run seed
```

App runs at: http://localhost:4321 (frontend) + http://localhost:8000 (API)

## Production Deployment

### Backend (Node.js hosting - Railway, Render, EC2, etc.)

1. Set environment variables:
   ```
   MONGODB_URL=mongodb+srv://...
   JWT_SECRET=<strong-random-secret>
   PORT=8000
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend-domain.com
   EMAIL=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. Deploy:
   ```bash
   cd Backend
   npm install --production
   npm start
   ```

### Frontend (Vercel, Netlify, or Node.js)

1. Set environment variable:
   ```
   PUBLIC_API_URL=https://your-backend-domain.com
   ```

2. Build & deploy:
   ```bash
   cd frontend-new
   npm install
   npm run build
   node dist/server/entry.mjs  # For Node.js hosting
   ```

   Or deploy to Vercel/Netlify with the build command `npm run build`.

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | rahul@mealhop.com | Password@123 |
| Customer | priya@mealhop.com | Password@123 |
| Customer | amit@mealhop.com | Password@123 |
| Owner | spicegarden@mealhop.com | Password@123 |
| Owner | pizzapalace@mealhop.com | Password@123 |
| Owner | dragonwok@mealhop.com | Password@123 |
| Delivery | ravi@mealhop.com | Password@123 |
| Delivery | suresh@mealhop.com | Password@123 |

## API Endpoints

| Route | Description |
|-------|-------------|
| `POST /api/auth/signup` | Register |
| `POST /api/auth/signin` | Login |
| `POST /api/auth/logout` | Logout |
| `GET /api/auth/me` | Current user |
| `GET /api/restaurants` | List restaurants |
| `GET /api/restaurants/:id` | Restaurant + menu |
| `POST /api/orders` | Place order |
| `GET /api/orders/my` | Customer orders |
| `GET /api/orders/owner/all` | Owner's orders |
| `PATCH /api/orders/:id/status` | Update order status |
| `GET /api/owner/analytics` | Business analytics |
| `POST /api/restaurants/menu` | Add menu item |
| `PUT /api/restaurants/menu/:id` | Update menu item |
| `DELETE /api/restaurants/menu/:id` | Delete menu item |
| `GET /api/delivery/orders/available` | Available deliveries |
| `POST /api/delivery/orders/:id/accept` | Accept delivery |
| `GET /api/delivery/earnings` | Delivery earnings |
| `GET /api/health` | Health check |

## Running Tests
```bash
cd Backend
npm test
```
