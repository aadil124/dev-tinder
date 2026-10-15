const adminAuth = (req, res, next) => {
  const token = "xyz1"; // Temporary token for learning
  const authenticated = token === "xyz";

  if (!authenticated) {
    return res.status(401).send("Unauthorized");
  }

  next();
};
const userAuth = (req, res, next) => {
  const token = "xyz"; // Temporary token for learning
  const authenticated = token === "xyz";
  console.log("Authenticated:", authenticated); // Log the authentication status
  if (!authenticated) {
    return res.status(401).send("user is Unauthorized");
  }

  next();
};

module.exports = {
  adminAuth,
  userAuth,
};
