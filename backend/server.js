const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
require("./queues/email.worker.js");

const app = express();

// Connect DB
connectDB();

/* ----------- CORS MUST BE FIRST ----------- */
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* ----------- BODY PARSER ----------- */
app.use(express.json());

/* ----------- HEALTH CHECK ----------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ----------- ROUTES ----------- */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/follow-ups", require("./routes/followUpRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/shipments", require("./routes/shipmentRoutes"));
app.use("/api/shipments-with-quotes", require("./routes/shipmentQuotesRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

/* ----------- STATIC ----------- */
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
