const express = require("express");
const { param } = require("express-validator");
const { generateSummary, getSummaryByPatient } = require("../controllers/summaryController");

const router = express.Router();

const patientIdValidator = [param("id").isMongoId().withMessage("Valid patient ID is required.")];

router.post("/:id/generate-summary", patientIdValidator, generateSummary);
router.get("/:id/summary", patientIdValidator, getSummaryByPatient);

module.exports = router;
