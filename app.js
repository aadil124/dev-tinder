const express = require("express");

const app = express();

app.use("/test/2", (req, res) => {
  res.send("Hello, World!, from /test/2 route");
});
app.use("/test", (req, res) => {
  res.send("Hello, World!, from /test route");
});

app.use("/hello", (req, res) => {
  res.send("Hello, World!, from /hello route");
});
app.use("/", (req, res) => {
  res.send("Hello, World!, from / route");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
