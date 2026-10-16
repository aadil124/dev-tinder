const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
require("dotenv").config();
app.use(express.json()); // middleware to parse JSON request bodies

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
