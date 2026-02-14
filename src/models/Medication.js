const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true,
      trim: true
    },
    frequency: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    adherenceStatus: {
      type: String,
      enum: ["good", "missed", "poor", "unknown"],
      default: "unknown"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Medication", medicationSchema);
