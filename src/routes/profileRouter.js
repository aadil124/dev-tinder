const express = require("express");
const { userAuth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const profileRouter = express.Router();

// get User Profile
profileRouter.get("/user", userAuth, async (req, res) => {
  try {
    const cookies = req.cookies;
    // console.log("Cookies:", cookies);
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

// send connection request
profileRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { id, firstName, lastName } = req.body;
  console.log("req.body", req.body);
  console.log("First Name:", firstName);
  console.log("Last Name:", lastName);
  res.status(200).send("Connection request sent successfully");
});
module.exports = profileRouter;
