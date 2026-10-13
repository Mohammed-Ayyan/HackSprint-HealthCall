/**
 * CareOps AI - Express Application Setup
 * 
 * Configures middleware, security, and route mounts.
 * Exported separately from server.js to facilitate isolated integration testing.
 */

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");

const app = express();

// 1. Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching whitelist
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Body Parsing Middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// 3. Health Check Endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "CareOps AI Auth & RBAC Service",
    timestamp: new Date().toISOString(),
  });
});

// 4. Mount Feature Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", require("./users/user.routes"));

// 5. Fallback & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
