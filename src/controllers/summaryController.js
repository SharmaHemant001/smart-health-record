const Patient = require("../models/Patient");
const Medication = require("../models/Medication");
const Visit = require("../models/Visit");
const Lab = require("../models/Lab");
const Summary = require("../models/Summary");
const { getAlertsForPatient } = require("../services/alertService");
const { generateClinicalSummary } = require("../services/aiService");

const generateSummary = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).lean();
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const [medications, visits, labs, alerts] = await Promise.all([
      Medication.find({ patientId: req.params.id }).sort({ startDate: -1 }).lean(),
      Visit.find({ patientId: req.params.id }).sort({ visitDate: -1 }).lean(),
      Lab.find({ patientId: req.params.id }).sort({ date: -1 }).lean(),
      getAlertsForPatient(req.params.id)
    ]);

    const summaryText = await generateClinicalSummary({
      patient,
      medications,
      visits,
      labs,
      alerts
    });

    const summary = await Summary.findOneAndUpdate(
      { patientId: req.params.id },
      {
        patientId: req.params.id,
        summaryText,
        generatedAt: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return res.status(200).json(summary);
  } catch (error) {
    return next(error);
  }
};

const getSummaryByPatient = async (req, res, next) => {
  try {
    const summary = await Summary.findOne({ patientId: req.params.id });

    if (!summary) {
      return res.status(404).json({ message: "No summary found. Generate one first." });
    }

    return res.status(200).json(summary);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateSummary,
  getSummaryByPatient
};
