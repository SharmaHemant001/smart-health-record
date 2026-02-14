const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 130
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"]
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    bloodGroup: {
      type: String,
      required: true,
      trim: true
    },
    allergies: {
      type: [String],
      default: []
    },
    chronicConditions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Patient", patientSchema);
