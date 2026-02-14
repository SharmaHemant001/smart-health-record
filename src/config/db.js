const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Set it in your environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
