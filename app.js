const express = require("express");

const app = express();

app.get("/admin/getUserData", (req, res) => {
  const token = "xyz"; // This should be replaced with actual token validation logic
  const authenticated = token === "xyz";
  if (!authenticated) {
    res.status(401).send("Unauthorized");
  } else {
    res.send("Hello, World!");
  }
});

app.get("/admin/deleteUserData", (req, res) => {
  const token = "xyz"; // This should be replaced with actual token validation logic
  const authenticated = token === "xyz";
  if (!authenticated) {
    res.status(401).send("Unauthorized");
  } else {
    res.send("User data deleted successfully");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
