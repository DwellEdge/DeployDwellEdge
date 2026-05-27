import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const signToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "8h",
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
    });

    const token = signToken(user);

    res.status(201).json({ message: "User created", token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") },
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // record login
    user.loginHistory = user.loginHistory || [];
    user.loginHistory.push({ date: new Date() });
    await user.save();

    const token = signToken(user);

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.log("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export default { register, login, changePassword };
