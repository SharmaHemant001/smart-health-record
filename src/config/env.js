const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  aiApiUrl: process.env.AI_API_URL || "https://mock-ai-service"
};

module.exports = env;
