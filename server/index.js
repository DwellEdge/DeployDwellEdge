import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/* ================= DB CONNECT ================= */
if (!process.env.ATLAS_URI) {
  console.error("❌ ATLAS_URI missing in .env file");
  process.exit(1);
}

mongoose.connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.log("❌ DB Connection Error:", err.message);
  });

/* ================= SCHEMAS ================= */

// 🔐 USER
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginHistory: [{ date: { type: Date, default: Date.now } }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);


// 💼 CAREERS (USED BY ADMIN UI)
const careerSchema = new mongoose.Schema({
  jobTitle: String,
  requiredSkills: String,
  description: String,
  department: String,
  location: String,
  type: { type: String, default: "Full-time" },
  isActive: { type: Boolean, default: true },
  createdBy: Number,
  createdDate: { type: Date, default: Date.now }
});

const Career = mongoose.model("Career", careerSchema, "careersCollection");


// 📄 APPLICATIONS
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true },
  firstName: String,
  lastName: String,
  mobileNumber: String,
  emailId: String,
  primarySkills: String,
  secondarySkills: String,
  totalExperience: Number,
  relevantExperience: Number,
  resume: String,
  submittedDate: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", applicationSchema, "CareerApplications");


/* ================= AUTH MIDDLEWARE ================= */

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};


/* ================= ROUTES ================= */

// TEST
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});


/* ================= AUTH ================= */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    res.json({ message: "User created", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    user.loginHistory.push({ date: new Date() });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, email: user.email });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================= CAREERS ================= */

// GET ALL
app.get("/careers", async (req, res) => {
  try {
    const jobs = await Career.find().sort({ createdDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD
app.post("/careers", async (req, res) => {
  try {
    const job = await Career.create(req.body);
    res.json(job); // 🔥 IMPORTANT (frontend needs full object)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/careers/:id", async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.patch("/careers/:id", async (req, res) => {
  try {
    const updated = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= APPLICATION ================= */

// APPLY
app.post("/apply", async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      jobId: new mongoose.Types.ObjectId(req.body.jobId)
    });

    res.json({ message: "Application submitted", application });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET APPLICATIONS
app.get("/applications", async (req, res) => {
  try {
    const apps = await Application.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= DB TEST ================= */

app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send("✅ DB Connected");
  } catch {
    res.send("❌ DB NOT Connected");
  }
});