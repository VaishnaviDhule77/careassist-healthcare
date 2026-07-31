const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Route Imports
const patientRoutes = require("./routes/patientRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const alertRoutes = require("./routes/alertRoutes");
const healthRoutes = require("./routes/healthRoutes");

// Service Imports
const startReminderService = require("./services/reminderService");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allows requests from any origin (e.g., Live Server on port 5500/5501)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CareAssist Healthcare Backend is running",
  });
});

// Primary API Routes
app.use("/api/patients", patientRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/health", healthRoutes);

// Alias Route for Singular "/api/patient" (Fixes common route mismatches)
app.use("/api/patient", patientRoutes);

// Optional: Direct Auth/Login Route (if not already handled inside patientRoutes)
app.post("/api/auth/login", (req, res, next) => {
  // Pass to patient routes if patientRoutes handles /login
  req.url = "/login";
  patientRoutes(req, res, next);
});

// 404 Handler for Unmatched Routes
app.use((req, res) => {
  console.warn(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Server Initialization
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in the environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    startReminderService();

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = async () => {
      console.log("\nShutting down server gracefully...");
      server.close(async () => {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("Server initialization failed:", error.message);
    process.exit(1);
  }
}

startServer();