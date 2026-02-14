const { validationResult } = require("express-validator");
const Lab = require("../models/Lab");
const Patient = require("../models/Patient");
const { rebuildPatientAlerts } = require("../services/alertService");

const createLab = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const lab = await Lab.create({
      ...req.body,
      patientId: req.params.id
    });

    await rebuildPatientAlerts(req.params.id);
    return res.status(201).json(lab);
  } catch (error) {
    return next(error);
  }
};

const getLabsByPatient = async (req, res, next) => {
  try {
    const labs = await Lab.find({ patientId: req.params.id }).sort({ date: -1 });
    return res.status(200).json(labs);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createLab,
  getLabsByPatient
};
