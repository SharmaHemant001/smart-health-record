const express = require("express");
const { body, param } = require("express-validator");
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientAlerts
} = require("../controllers/patientController");

const router = express.Router();

const patientValidationRules = [
  body("name").trim().notEmpty().withMessage("Patient name is required."),
  body("age").isInt({ min: 0, max: 130 }).withMessage("Age must be between 0 and 130."),
  body("gender").isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other."),
  body("phone").trim().notEmpty().withMessage("Phone number is required."),
  body("bloodGroup").trim().notEmpty().withMessage("Blood group is required."),
  body("allergies").optional().isArray().withMessage("Allergies must be an array."),
  body("allergies.*").optional().isString().withMessage("Each allergy must be a string."),
  body("chronicConditions").optional().isArray().withMessage("Chronic conditions must be an array."),
  body("chronicConditions.*").optional().isString().withMessage("Each chronic condition must be a string.")
];

const patientUpdateValidationRules = [
  body("name").optional().trim().notEmpty().withMessage("Patient name cannot be empty."),
  body("age").optional().isInt({ min: 0, max: 130 }).withMessage("Age must be between 0 and 130."),
  body("gender").optional().isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other."),
  body("phone").optional().trim().notEmpty().withMessage("Phone number cannot be empty."),
  body("bloodGroup").optional().trim().notEmpty().withMessage("Blood group cannot be empty."),
  body("allergies").optional().isArray().withMessage("Allergies must be an array."),
  body("allergies.*").optional().isString().withMessage("Each allergy must be a string."),
  body("chronicConditions").optional().isArray().withMessage("Chronic conditions must be an array."),
  body("chronicConditions.*").optional().isString().withMessage("Each chronic condition must be a string.")
];

const patientIdValidator = [param("id").isMongoId().withMessage("Valid patient ID is required.")];

router.post("/", patientValidationRules, createPatient);
router.get("/", getPatients);
router.get("/:id/alerts", patientIdValidator, getPatientAlerts);
router.get("/:id", patientIdValidator, getPatientById);
router.put("/:id", [...patientIdValidator, ...patientUpdateValidationRules], updatePatient);
router.delete("/:id", patientIdValidator, deletePatient);

module.exports = router;
