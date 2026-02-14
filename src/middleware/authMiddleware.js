const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: token missing." });
  }

  const token = authHeader.split(" ")[1];

  if (!jwtSecret) {
    return res.status(500).json({ message: "Server JWT configuration is missing." });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token." });
  }
};

module.exports = authMiddleware;
