const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const isPlaceholderMongoUri = (uri) => {
  if (!uri || typeof uri !== "string") {
    return false;
  }

  return uri.includes("<db_username>") || uri.includes("<db_password>");
};

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Set it in your environment variables.");
  }

  if (isPlaceholderMongoUri(mongoUri)) {
    throw new Error("MONGO_URI has placeholder values. Replace <db_username> and <db_password> in .env.");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000
  });
  console.log("MongoDB connected");
};

module.exports = connectDB;
