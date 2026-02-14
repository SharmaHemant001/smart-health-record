const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    visitDate: {
      type: Date,
      required: true
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true
    },
    procedures: {
      type: [String],
      default: []
    },
    doctorNotes: {
      type: String,
      default: ""
    },
    followUpDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Visit", visitSchema);
