const express = require("express");
const { body, param } = require("express-validator");
const { createVisit, getVisitsByPatient } = require("../controllers/visitController");

const router = express.Router();

router.post(
  "/:id/visits",
  [
    param("id").isMongoId().withMessage("Valid patient ID is required."),
    body("visitDate").isISO8601().withMessage("visitDate must be a valid date."),
    body("diagnosis").trim().notEmpty().withMessage("Diagnosis is required."),
    body("procedures").optional().isArray().withMessage("procedures must be an array."),
    body("procedures.*").optional().isString().withMessage("Each procedure must be a string."),
    body("doctorNotes").optional().isString().withMessage("doctorNotes must be text."),
    body("followUpDate").optional().isISO8601().withMessage("followUpDate must be a valid date.")
  ],
  createVisit
);

router.get("/:id/visits", [param("id").isMongoId().withMessage("Valid patient ID is required.")], getVisitsByPatient);

module.exports = router;
