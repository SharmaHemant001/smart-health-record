const dotenv = require("dotenv");

dotenv.config();

const parsePort = (value) => {
  const port = Number(value);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return 5000;
  }

  return port;
};

const env = {
  port: parsePort(process.env.PORT),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  aiApiUrl: process.env.AI_API_URL || "https://mock-ai-service"
};

module.exports = env;
