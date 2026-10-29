const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const {
  validateEmail,
  validatePassword,
  validateUserId,
  validateUpdateData,
  validateSkills,
} = require("./utils/validations");

const app = express();
app.use(cookieParser());
app.use(express.json());

// ========================================
// GET ALL USERS
// ========================================
app.get("/feed", async (req, res) => {
  try {
    const userList = await User.find().select("-password");

    if (userList.length === 0) {
      return res.status(404).send("No users found");
    }

    return res.status(200).json(userList);
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// ========================================
// GET USER BY EMAIL
// ========================================
app.get("/user", async (req, res) => {
  const userEmail = req.query.email;

  try {
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }

    if (!validateEmail(userEmail)) {
      return res.status(400).send("Invalid email format");
    }

    const user = await User.findOne({
      email: userEmail.toLowerCase().trim(),
    }).select("-password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// ========================================
// SIGNUP
// ========================================
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).send("Invalid credentials");
    } else {
      // create token and set it in the cookie
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      // sending a dummy token for demonstration purposes
      res.cookie("token", token);
      return res.status(200).send("Login successful");
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// get Profile
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log("Cookies:", cookies);
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    // find user in DB
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// ========================================
// DELETE USER BY ID
// ========================================
app.delete("/user", async (req, res) => {
  const { userId } = req.body;

  try {
    if (!validateUserId(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("User deleted successfully");
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// ========================================
// UPDATE USER BY ID (PATCH)
// ========================================
app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { updateData } = req.body;

  try {
    // Validate user ID
    if (!validateUserId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Validate update data
    const validation = validateUpdateData(updateData);

    if (!validation.valid) {
      return res.status(400).json(validation);
    }

    // Validate skills
    if (updateData.skills !== undefined) {
      if (!validateSkills(updateData.skills)) {
        return res.status(400).json({
          message: "Skills must contain between 1 and 5 non-empty strings",
        });
      }

      updateData.skills = updateData.skills.map((skill) => skill.trim());
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "User validation failed",
        errors: Object.values(err.errors).map((error) => error.message),
      });
    }

    return res.status(500).json({
      message: "Failed to update user",
    });
  }
});

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
