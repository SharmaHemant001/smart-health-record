const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    testName: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: ""
    },
    normalRange: {
      type: String,
      default: ""
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Lab", labSchema);
