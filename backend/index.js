require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= ENV ================= */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* ================= UPLOAD FOLDER ================= */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= MONGO ================= */
const client = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  }
}
connectDB();

/* ================= ROUTES ================= */

/* ---- CREATE POST ---- */
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const photos = db.collection("photos");

    const post = {
      username: req.body.username,
      caption: req.body.caption,
      file_url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
      upload_time: new Date()
    };

    await photos.insertOne(post);
    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ---- GET POSTS / SEARCH USER ---- */
app.get("/files", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not connected" });

    const photos = db.collection("photos");
    const { username } = req.query;

    let query = {};
    if (username) {
      query.username = { $regex: `^${username}`, $options: "i" };
    }

    const posts = await photos
      .find(query)
      .sort({ upload_time: -1 })
      .toArray();

    res.status(200).json(posts);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ---- DELETE POST ---- */
app.delete("/delete/:id", async (req, res) => {
  try {
    const photos = db.collection("photos");
    const _id = new ObjectId(req.params.id);

    await photos.deleteOne({ _id });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
