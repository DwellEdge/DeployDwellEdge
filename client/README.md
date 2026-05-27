# Dwelledge Client

React + Vite frontend for the Dwelledge website and employee dashboard.

## Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Configure backend URL in `.env.local`:
```bash
VITE_API_URL=http://localhost:5001
```

3. Start dev server:
```bash
npm run dev
```

Server runs on `http://localhost:5173`

## Authentication

Auth state managed via `AuthContext` in `context/AuthContext.jsx`:

```jsx
import { useAuth } from "./context/AuthContext.jsx";

function MyComponent() {
  const { login, register, logout, user, isAuthenticated } = useAuth();

  // login(email, password) - returns { success, user/error }
  // register(email, password, firstName, lastName) - returns { success, user/error }
  // logout() - clears token and user
}
```

## API Setup

Axios instance (`utils/axios.js`):
- ✅ Auto attaches bearer token from localStorage
- ✅ Auto redirects to `/login` on 401 (expired token)
- ✅ Base URL from `VITE_API_URL` env var

## Routes

Routes defined in `App.jsx`:
- `/` - Home
- `/careers` - Job listings
- `/apply` - Apply for job
- `/contact` - Contact form
- `/login` - Employee login
- `/admin` - Admin dashboard
- `/admin/JobListing` - Manage jobs
- `/admin/employeepage` - Manage employees
- `/admin/founders` - Manage founders
- `/admin/Applicants` - View applications

Protected routes should use `useAuth()` to check `isAuthenticated` and redirect if not.

## Build

```bash
npm run build  # output: dist/
npm run preview
npm run lint
```
