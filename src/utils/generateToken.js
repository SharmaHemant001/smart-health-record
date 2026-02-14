const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

const generateToken = (payload) => {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing. Set it in your environment variables.");
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
};

module.exports = generateToken;
