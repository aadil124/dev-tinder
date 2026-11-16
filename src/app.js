// Load environment variables first
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");

const app = express();

// ========================================
// GLOBAL MIDDLEWARE
// ========================================

// Parse JSON request body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// ========================================
// ROUTES
// ========================================

app.use("/", authRouter);
app.use("/", profileRouter);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevTinder API is running",
  });
});

// ========================================
// CONNECT DATABASE AND START SERVER
// ========================================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
