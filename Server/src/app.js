import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { testConnection } from "./database/index.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Test database connection on startup
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

// Middleware
// Use CORS_ORIGIN from .env, support comma-separated origins
let allowedOrigins = ["http://localhost:5173"];
if (process.env.CORS_ORIGIN) {
  allowedOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
}
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Connection route
app.get("/", (req, res) => {
  console.log("frontend is connected");
  res.json({ message: "backend is connected" });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Database test route
app.get("/db-test", async (req, res) => {
  try {
    const connected = await testConnection();
    res.json({
      status: connected ? "ok" : "error",
      message: connected
        ? "Database connected successfully"
        : "Database connection failed",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// API routes

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/partners', partnerRoutes);

console.log('✅ All routes configured:');
console.log('   - GET  /');
console.log('   - GET  /health');
console.log('   - GET  /db-test');
console.log('   - POST /api/auth/signup');
console.log('   - POST /api/auth/login');
console.log('   - POST /api/auth/forgot-password');
console.log('   - POST /api/auth/verify-otp');
console.log('   - POST /api/auth/reset-password');
console.log('   - POST /api/partners/signup');
console.log('   - POST /api/partners/login');
console.log('   - GET  /api/partners/test');

export default app;
