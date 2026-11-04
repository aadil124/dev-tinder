const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
// app.use("/profile", profileRouter);

// ========================================
// CONNECT DATABASE AND START SERVER
// ========================================
connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
