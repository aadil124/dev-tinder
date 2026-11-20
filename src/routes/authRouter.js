const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");

const { validateEmail, validatePassword } = require("../utils/validations");

// ========================================
// SIGNUP
// ========================================
authRouter.post("/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, phoneNumber } =
      req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      age === undefined ||
      !gender ||
      !phoneNumber
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password,
      age,
      gender,
      phoneNumber,
    });

    // Save user (pre-save hook hashes password)
    await user.save();

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Duplicate email
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "User validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      message: "Unable to create user",
    });
  }
});

// ========================================
// LOGIN
// ========================================
authRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = user.getJWT();

    // Set authentication cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// ========================================
// LOGOUT
// ========================================
authRouter.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
});

module.exports = authRouter;
