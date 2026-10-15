const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);
// app.use("/user", userAuth);
app.get("/user/login", (req, res) => {
  res.send("User logged in successfully");
});
app.get("/user/getUserData", userAuth, (req, res) => {
  res.send("Hello, World!");
});

app.get("/user/deleteUserData", (req, res) => {
  res.send("User data deleted successfully");
});

app.get("/admin/getUserData", (req, res) => {
  res.send("Hello, World!");
});

app.get("/admin/deleteUserData", (req, res) => {
  res.send("User data deleted successfully");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
