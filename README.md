# Server

This folder contains the Express backend for the Dwelledge site.

Main entry: `index.js`

Environment variables: copy `.env.example` to `.env` and fill values.

Endpoints summary:
- `GET /` - root health check
- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login user (returns JWT)
- `POST /api/auth/change-password` - change password
- Careers, Employees, Founders, Applications routes are defined in `index.js`.

Uploads are served from `/uploads` and stored in the `uploads/` folder.
