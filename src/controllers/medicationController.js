const { validationResult } = require("express-validator");
const Medication = require("../models/Medication");
const Patient = require("../models/Patient");
const { rebuildPatientAlerts } = require("../services/alertService");

const createMedication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const medication = await Medication.create({
      ...req.body,
      patientId: req.params.id
    });

    await rebuildPatientAlerts(req.params.id);
    return res.status(201).json(medication);
  } catch (error) {
    return next(error);
  }
};

const getMedicationsByPatient = async (req, res, next) => {
  try {
    const medications = await Medication.find({ patientId: req.params.id }).sort({ startDate: -1 });
    return res.status(200).json(medications);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createMedication,
  getMedicationsByPatient
};
