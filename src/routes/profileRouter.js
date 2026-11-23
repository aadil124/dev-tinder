const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

const profileRouter = express.Router();

// ========================================
// GET USER PROFILE
// ========================================
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // User is already fetched by userAuth middleware
    const user = req.user.toObject();

    // Remove sensitive information
    delete user.password;

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Unable to fetch profile",
    });
  }
});

// ========================================
// UPDATE USER PROFILE
// ========================================
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // Validate request data
    const isValid = validateEditProfileData(req);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid profile update data",
      });
    }

    // Get logged-in user
    const loggedInUser = req.user;

    // Update allowed fields
    Object.assign(loggedInUser, req.body);

    // Save updated user
    await loggedInUser.save();

    // Prepare response without password
    const updatedUser = loggedInUser.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message: `${loggedInUser.firstName}, profile updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Profile validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      message: "Unable to update profile",
    });
  }
});

module.exports = profileRouter;
