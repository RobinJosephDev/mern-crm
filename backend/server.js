const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.post("/api/auth/register", (req, res) => {
  res.send("DIRECT register works");
});

app.use("/api/leads", require("./routes/leadRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
