const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ["abnormal_lab", "missed_followup", "medication_adherence"]
    },
    message: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Alert", alertSchema);
