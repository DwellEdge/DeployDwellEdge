import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* CONNECT DB */
mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log("✅ MongoDB Connected to dwelledgeDB"))
  .catch(err => console.log("❌ DB Error:", err));

/* ================= SCHEMAS ================= */

// 🔥 Career Schema
const careerSchema = new mongoose.Schema({
  jobTitle: String,
  requiredSkills: String,
  description: String,
  createdBy: Number,
  createdDate: {
    type: Date,
    default: Date.now
  }
});

// ✅ FIX: DEFINE Career MODEL (THIS WAS MISSING)
const Career = mongoose.model(
  "Career",
  careerSchema,
  "careersCollection"   // your collection name
);


// 🔥 Application Schema
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
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
  submittedDate: {
    type: Date,
    default: Date.now
  }
});

// ✅ Collection name: CareerApplications
const Application = mongoose.model(
  "Application",
  applicationSchema,
  "CareerApplications"
);


/* ================= ROUTES ================= */

// ✅ TEST
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});


// 🔥 GET ALL JOBS
app.get("/careers", async (req, res) => {
  try {
    const jobs = await Career.find();
    res.json(jobs);   // MUST be array
  } catch (err) {
    console.log("❌ GET careers error:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔥 ADD JOB
app.post("/careers", async (req, res) => {
  try {
    const job = new Career(req.body);
    await job.save();
    res.status(201).json({ message: "Job added successfully" });
  } catch (err) {
    console.log("❌ POST careers error:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔥 APPLY JOB
app.post("/apply", async (req, res) => {
  try {
    console.log("📥 Incoming Data:", req.body);

    const application = new Application({
      jobId: new mongoose.Types.ObjectId(req.body.jobId),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobileNumber: req.body.mobileNumber,
      emailId: req.body.emailId,
      primarySkills: req.body.primarySkills,
      secondarySkills: req.body.secondarySkills,
      totalExperience: Number(req.body.totalExperience),
      relevantExperience: Number(req.body.relevantExperience),
      resume: req.body.resume
    });

    await application.save();

    console.log("✅ Saved to CareerApplications");

    res.status(201).json({ message: "Application saved successfully" });

  } catch (err) {
    console.log("❌ APPLY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔥 GET APPLICATIONS
app.get("/applications", async (req, res) => {
  try {
    const apps = await Application.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= SERVER ================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});