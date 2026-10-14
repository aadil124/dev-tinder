const express = require("express");

const app = express();

// app.get(/\/ab?c/, (req, res) => {
//   console.log("data successfully received GET CALL");
//   res.send("Get the user data");
// });

app.use(
  "/user",
  (req, res, next) => {
    // res.send("1st Response from user route");
    next();
    res.send("1st Response from user route");
  },
  (req, res, next) => {
    // res.send("2nd Response from user route");
    next();
  },
  (req, res, next) => {
    // res.send("3rd Response from user route");
    next();
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
