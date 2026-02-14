const { validationResult } = require("express-validator");
const Patient = require("../models/Patient");
const Medication = require("../models/Medication");
const Visit = require("../models/Visit");
const Lab = require("../models/Lab");
const Alert = require("../models/Alert");
const Summary = require("../models/Summary");
const { getAlertsForPatient } = require("../services/alertService");

const createPatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.create(req.body);
    return res.status(201).json(patient);
  } catch (error) {
    return next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    return res.status(200).json(patients);
  } catch (error) {
    return next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Cascade delete all patient-linked records to avoid orphaned data.
    await Promise.all([
      Medication.deleteMany({ patientId: req.params.id }),
      Visit.deleteMany({ patientId: req.params.id }),
      Lab.deleteMany({ patientId: req.params.id }),
      Alert.deleteMany({ patientId: req.params.id }),
      Summary.deleteMany({ patientId: req.params.id })
    ]);

    return res.status(200).json({ message: "Patient and related records deleted." });
  } catch (error) {
    return next(error);
  }
};

const getPatientAlerts = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const alerts = await getAlertsForPatient(req.params.id);
    return res.status(200).json(alerts);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientAlerts
};
