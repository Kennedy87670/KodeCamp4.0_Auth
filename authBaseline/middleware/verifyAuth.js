const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      message: "No token present",
    });
  }

  const [strategy, token] = authHeader.split(" ");

  if (strategy !== "Bearer") {
    return res.status(500).json({
      status: "Invalid Auth Strategy",
      message: "User is not logged in",
    });
  }

  try {
    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    req.userDetails = userDetails;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.name === "TokenExpiredError" ? "Token has expired" : "Invalid token",
    });
  }
};

module.exports = verifyAuth;
