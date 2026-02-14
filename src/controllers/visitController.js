const { validationResult } = require("express-validator");
const Visit = require("../models/Visit");
const Patient = require("../models/Patient");
const { rebuildPatientAlerts } = require("../services/alertService");

const createVisit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const visit = await Visit.create({
      ...req.body,
      patientId: req.params.id
    });

    await rebuildPatientAlerts(req.params.id);
    return res.status(201).json(visit);
  } catch (error) {
    return next(error);
  }
};

const getVisitsByPatient = async (req, res, next) => {
  try {
    const visits = await Visit.find({ patientId: req.params.id }).sort({ visitDate: -1 });
    return res.status(200).json(visits);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createVisit,
  getVisitsByPatient
};
