const express = require("express");
const { body, param } = require("express-validator");
const { createMedication, getMedicationsByPatient } = require("../controllers/medicationController");

const router = express.Router();

router.post(
  "/:id/medications",
  [
    param("id").isMongoId().withMessage("Valid patient ID is required."),
    body("name").trim().notEmpty().withMessage("Medication name is required."),
    body("dosage").trim().notEmpty().withMessage("Dosage is required."),
    body("frequency").trim().notEmpty().withMessage("Frequency is required."),
    body("startDate").isISO8601().withMessage("startDate must be a valid date."),
    body("endDate").optional().isISO8601().withMessage("endDate must be a valid date."),
    body("adherenceStatus")
      .optional()
      .isIn(["good", "missed", "poor", "unknown"])
      .withMessage("adherenceStatus must be good, missed, poor, or unknown.")
  ],
  createMedication
);

router.get("/:id/medications", [param("id").isMongoId().withMessage("Valid patient ID is required.")], getMedicationsByPatient);

module.exports = router;
