# Setup Guide

1. Install dependencies

```bash
cd server
npm install
```

2. Create `.env` from `.env.example` and set values (MongoDB connection, email creds, JWT_SECRET)

3. Start server

```bash
npm start
```

4. Uploads will be stored in `uploads/`. Ensure the folder exists and is writable.
