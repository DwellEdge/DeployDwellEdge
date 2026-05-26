import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 5001; // 🔥 changed to 5001 to avoid conflict
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/* ================= CHECK ENV ================= */
if (!process.env.ATLAS_URI) {
  console.error("❌ ATLAS_URI missing in .env file");
  process.exit(1);
}

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

/* ================= SCHEMAS ================= */

// USER
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loginHistory: [{ date: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// CAREERS
const careerSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  requiredSkills: { type: String, default: "" },
  description: { type: String, default: "" },
  department: { type: String, default: "" },
  location: { type: String, default: "" },
  type: { type: String, default: "Full-time" },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Number, default: 1 },
  createdDate: { type: Date, default: Date.now },
});

const Career = mongoose.model("Career", careerSchema, "careersCollection");

// APPLICATIONS
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Career",
  },
  firstName: String,
  lastName: String,
  mobileNumber: String,
  emailId: String,
  primarySkills: String,
  secondarySkills: String,
  totalExperience: Number,
  relevantExperience: Number,
  resume: String,
  submittedDate: { type: Date, default: Date.now },
});

const Application = mongoose.model(
  "Application",
  applicationSchema,
  "CareerApplications",
);

// 👨‍💼 EMPLOYEE MODEL
const employeeSchema = new mongoose.Schema({
  employee_code: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  mobile_number: String,
  email_id: String,
  date_of_birth: Date,
  date_of_joining: Date,
  designation: String,
  employment_type: String,
  work_location: String,
  status: { type: String, default: "Active" },
  date_of_exit: Date,
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema, "EmployeeDetails");

/* ================= EMPLOYEES ================= */

// GET all employees
// GET ALL EMPLOYEES
app.get("/api/employees", async (req, res) => {
  const data = await Employee.find();
  res.json(data);
});

// ADD EMPLOYEE
app.post("/api/employees", async (req, res) => {
  const emp = await Employee.create(req.body);
  res.json(emp);
});

// DELETE
app.delete("/api/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE employee
app.patch("/api/employees/:id", async (req, res) => {
    const emp = await Employee.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_date: new Date() },
    { new: true },
  );
  res.json(emp);
});

// 👨‍💼 FOUNDERS MODEL
const founderSchema = new mongoose.Schema({
  founder_id: String,
  founder_name: String,
  first_name: String,
  last_name: String,
  status: String,
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

const Founder = mongoose.model("Founder", founderSchema, "FounderDetails");

/* ================= FOUNDERS ================= */

// GET ALL
app.get("/api/founders", async (req, res) => {
  try {
    const founders = await Founder.find().sort({ created_date: -1 });
    res.json(founders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD
app.post("/api/founders", async (req, res) => {
  try {
    const founder = await Founder.create(req.body);
    res.json(founder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/founders/:id", async (req, res) => {
  try {
    await Founder.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ROUTES ================= */

// ROOT
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});

/* ================= AUTH ================= */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

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

    // ✅ CASE-INSENSITIVE EMAIL SEARCH
    const user = await User.findOne({
      email: {
        $regex: new RegExp("^" + email + "$", "i"),
      },
    });

    // ❌ USER NOT FOUND
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ✅ CHECK PASSWORD
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ✅ TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    // ✅ SUCCESS
    res.json({
      token,
      email: user.email,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* ================= CAREERS ================= */

// GET JOBS
app.get("/careers", async (req, res) => {
  try {
    const jobs = await Career.find().sort({ createdDate: -1 });

    console.log("📦 Jobs from DB:", jobs.length);

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD JOB
app.post("/careers", async (req, res) => {
  try {
    const job = new Career(req.body);
    await job.save();

    res.json(job); // ✅ return full object
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE JOB
app.delete("/careers/:id", async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE JOB
app.patch("/careers/:id", async (req, res) => {
  try {
    const updated = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= APPLICATION ================= */

app.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const applicationData = {
      ...req.body,
      jobId: new mongoose.Types.ObjectId(req.body.jobId),
      resume: req.file ? req.file.filename : null,
    };

    const application = new Application(applicationData);
    await application.save();
    res.json({ message: "Application submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL APPLICATIONS
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId", "jobTitle");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DOWNLOAD APPLICATION RESUME
app.get("/api/applications/:id/resume", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "jobId",
      "jobTitle",
    );
    if (!application || !application.resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const originalName = application.resume;
    const extension = path.extname(originalName) || ".pdf";
    const jobTitle = application.jobId?.jobTitle || "job";
    const fullName =
      `${application.firstName || "candidate"}_${application.lastName || ""}`.trim() ||
      "candidate";
    const safeName = `${jobTitle}_${fullName}_Resume${extension}`
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const filePath = path.join(__dirname, "uploads", originalName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `File not found: ${originalName}` });
    }

    res.download(filePath, safeName, (err) => {
      if (err) {
        console.error("Resume download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Unable to download resume" });
        }
      }
    });
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

/* ================= START SERVER ================= */

// 🔥 HANDLE PORT IN USE ERROR
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`❌ Port ${PORT} already in use. Try another port.`);
  } else {
    console.log("❌ Server Error:", err);
  }
});
