const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello, World!, from /test route");
});
app.get("/user", (req, res) => {
  console.log("data successfully received GET CALL");
  res.send("Get the user data");
});
app.post("/user", (req, res) => {
  console.log("data successfully received");
  res.send("Create a new user");
});
app.put("/user", (req, res) => {
  console.log("data successfully updated");
  res.send("Update the user data");
});
app.delete("/user", (req, res) => {
  console.log("data successfully deleted");
  res.send("Delete   the user data");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
