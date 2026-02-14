const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authMiddleware = require("./middleware/authMiddleware");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const medicationRoutes = require("./routes/medicationRoutes");
const visitRoutes = require("./routes/visitRoutes");
const labRoutes = require("./routes/labRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", authMiddleware, patientRoutes);
app.use("/api/patients", authMiddleware, medicationRoutes);
app.use("/api/patients", authMiddleware, visitRoutes);
app.use("/api/patients", authMiddleware, labRoutes);
app.use("/api/patients", authMiddleware, summaryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
