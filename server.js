const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://stock-inventory.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Define a basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
