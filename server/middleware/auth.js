import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

  const parts = authHeader.split(" ");
  const token = parts.length === 2 && parts[0].toLowerCase() === "bearer" ? parts[1] : null;
  if (!token) return res.status(401).json({ message: "Invalid Authorization format" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // contains id, email, role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default { requireAuth };
