# BuyerPortal

A full-stack real-estate buyer portal where users can register, log in,
browse property listings, and save favourites — all scoped privately per user.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs  
**Frontend:** React (Vite), React Router, Axios

---

## Project Structure

```
TECHKRAFT-ASSIGN/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── favouritesController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Favourite.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── favourites.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       └── Dashboard.jsx
    ├── .env
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account (free tier is fine)

---

### 1. Clone the repository

```bash
git clone https://github.com/SanjeetaAcharya/TECHKRAFT-ASSIGN.git
cd TECHKRAFT-ASSIGN
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/buyerportal
JWT_SECRET=your_super_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Reference

### Auth

| Method | Endpoint             | Body                        | Description        |
| ------ | -------------------- | --------------------------- | ------------------ |
| POST   | `/api/auth/register` | `{ name, email, password }` | Register new user  |
| POST   | `/api/auth/login`    | `{ email, password }`       | Login, returns JWT |

### Favourites (all require `Authorization: Bearer <token>`)

| Method | Endpoint              | Body                                     | Description                   |
| ------ | --------------------- | ---------------------------------------- | ----------------------------- |
| GET    | `/api/favourites`     | —                                        | Get current user's favourites |
| POST   | `/api/favourites`     | `{ propertyId, title, location, price }` | Add a favourite               |
| DELETE | `/api/favourites/:id` | —                                        | Remove a favourite (own only) |

---

## Example Flow

### 1. Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sanjeeta","email":"sanjeeta@email.com","password":"Pass1234"}'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sanjeeta@email.com","password":"Pass1234"}'
```

Copy the `token` from the response.

### 3. Add a favourite

```bash
curl -X POST http://localhost:5000/api/favourites \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"propertyId":"prop001","title":"Modern Apartment in Thamel","location":"Thamel, Kathmandu","price":25000}'
```

### 4. View favourites

```bash
curl http://localhost:5000/api/favourites \
  -H "Authorization: Bearer <your_token>"
```

### 5. Remove a favourite

```bash
curl -X DELETE http://localhost:5000/api/favourites/<favourite_id> \
  -H "Authorization: Bearer <your_token>"
```

---

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT with 7-day expiry
- Auth rate limited to 20 requests per 15 minutes
- Users can only read/delete their own favourites
- HTTP security headers via Helmet

---

## Environment Variables

| Variable       | Where    | Description                |
| -------------- | -------- | -------------------------- |
| `MONGO_URI`    | backend  | MongoDB connection string  |
| `JWT_SECRET`   | backend  | Secret for signing JWTs    |
| `PORT`         | backend  | Server port (default 5000) |
| `CLIENT_URL`   | backend  | Allowed CORS origin        |
| `VITE_API_URL` | frontend | Backend base URL           |
