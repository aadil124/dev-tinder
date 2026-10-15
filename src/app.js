const express = require("express");

const app = express();

app.get("/user/getUserData", (req, res) => {
  res.send("Hello, World!");
});

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
