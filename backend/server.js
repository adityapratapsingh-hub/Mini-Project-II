
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const moodRoutes = require("./routes/mood");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MoodMix server is running!"
  });
});

app.use("/api/mood", moodRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`MoodMix running at http://localhost:${PORT}`);
});
