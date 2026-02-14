const app = require("./src/app");
const connectDB = require("./src/config/db");
const { port } = require("./src/config/env");

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`MedMemory backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
