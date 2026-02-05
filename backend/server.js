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

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/follow-ups", require("./routes/followUpRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/shipments", require("./routes/shipmentRoutes"));
app.use("/api/shipments-with-quotes", require("./routes/shipmentQuotesRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Static files
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
