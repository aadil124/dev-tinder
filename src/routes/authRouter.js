const express = require("express");
const { validateEmail, validatePassword } = require("../utils/validations");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// signup
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).send("Invalid email format");
    }

    // Validate password
    if (!validatePassword(password)) {
      return res
        .status(400)
        .send(
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      ...req.body,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Signup error:", err);

    // Handle duplicate email
    if (err.code === 11000) {
      return res.status(409).send("Email already exists");
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "User validation failed",
        errors: Object.values(err.errors).map((error) => error.message),
      });
    }

    return res.status(500).send("Unable to create user");
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(404).send("Invalid credentials");
    } else {
      // Generate JWT using the User model method
      const token = user.getJWT();

      // Set token in cookie
      res.cookie("token", token);

      return res.status(200).send("Login successful");
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = authRouter;
