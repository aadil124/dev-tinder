const express = require("express");
const { userAuth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const profileRouter = express.Router();

// get User Profile
// profileRouter.get("/profile/view", userAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     return res.status(200).json({ user });
//   } catch (err) {
//     console.error("Get profile error:", err);
//     return res.status(500).send("Internal Server Error");
//   }
// });

module.exports = profileRouter;
