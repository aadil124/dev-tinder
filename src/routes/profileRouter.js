const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validations");
const profileRouter = express.Router();

// get User Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request!!!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, Data updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
