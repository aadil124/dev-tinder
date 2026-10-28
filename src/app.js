const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
app.use(express.json()); // middleware to parse JSON request bodies

//get all users
app.get("/feed", async (req, res) => {
  const userList = await User.find();

  try {
    if (userList.length === 0) {
      return res.status(404).send("No users found");
    } else {
      res.status(200).send(userList);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// get one user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email; // Assuming the email is sent in the request body
  try {
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }
    const user = await User.find({ email: userEmail }); // Find the user by email
    if (user.length === 0) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).send("Invalid email format");
    }

    // 2. Validate password
    if (
      !password ||
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res
        .status(400)
        .send(
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
        );
    }

    // 3. Create user
    const user = new User(req.body);

    // 4. Save user to MongoDB
    await user.save();

    return res.status(201).send("User created successfully");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// Update user by ID
app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { updateData } = req.body;

  try {
    // 1. Validate MongoDB user ID
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // 2. Validate updateData
    if (
      !updateData ||
      typeof updateData !== "object" ||
      Array.isArray(updateData)
    ) {
      return res.status(400).json({
        message: "updateData must be a valid object",
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Update data cannot be empty",
      });
    }

    // 3. Allow only specific fields to be updated
    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "phoneNumber",
      "about",
      "skills",
      "photoUrl",
    ];

    const invalidFields = Object.keys(updateData).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid fields provided",
        invalidFields,
      });
    }

    // 4. Validate skills: between 1 and 5 non-empty strings
    if (updateData.skills !== undefined) {
      const { skills } = updateData;

      if (
        !Array.isArray(skills) ||
        skills.length < 1 ||
        skills.length > 5 ||
        !skills.every(
          (skill) => typeof skill === "string" && skill.trim().length > 0,
        )
      ) {
        return res.status(400).json({
          message: "Skills must contain between 1 and 5 non-empty strings",
        });
      }

      // Remove surrounding whitespace from each skill
      updateData.skills = skills.map((skill) => skill.trim());
    }

    // 5. Update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    // 6. Check whether user exists
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 7. Send success response
    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);

    return res.status(400).json({
      message: "Failed to update user",
      error: err.message,
    });
  }
});

// Connect to MongoDB
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
