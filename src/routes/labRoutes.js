const express = require("express");
const { body, param } = require("express-validator");
const { createLab, getLabsByPatient } = require("../controllers/labController");

const router = express.Router();

router.post(
  "/:id/labs",
  [
    param("id").isMongoId().withMessage("Valid patient ID is required."),
    body("testName").trim().notEmpty().withMessage("testName is required."),
    body("value").isNumeric().withMessage("value must be numeric."),
    body("unit").optional().isString().withMessage("unit must be text."),
    body("normalRange").optional().isString().withMessage("normalRange must be text."),
    body("date").optional().isISO8601().withMessage("date must be a valid date.")
  ],
  createLab
);

router.get("/:id/labs", [param("id").isMongoId().withMessage("Valid patient ID is required.")], getLabsByPatient);

module.exports = router;
