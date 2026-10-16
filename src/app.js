const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
require("dotenv").config();
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
  const user = new User(req.body);
  await user.save();

  try {
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(400).send(err);
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
