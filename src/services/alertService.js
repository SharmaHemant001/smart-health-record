const Alert = require("../models/Alert");
const Lab = require("../models/Lab");
const Visit = require("../models/Visit");
const Medication = require("../models/Medication");

const RULE_BASED_TYPES = ["abnormal_lab", "missed_followup", "medication_adherence"];

const parseNormalRange = (rangeText) => {
  if (!rangeText || typeof rangeText !== "string") {
    return {};
  }

  const normalized = rangeText.replace(/\s/g, "");

  if (normalized.includes("-")) {
    const [low, high] = normalized.split("-").map(Number);
    if (Number.isFinite(low) && Number.isFinite(high)) {
      return { low, high };
    }
  }

  if (normalized.startsWith("<")) {
    const high = Number(normalized.slice(1));
    if (Number.isFinite(high)) {
      return { high };
    }
  }

  if (normalized.startsWith(">")) {
    const low = Number(normalized.slice(1));
    if (Number.isFinite(low)) {
      return { low };
    }
  }

  return {};
};

const abnormalLabSeverity = (deviationRatio) => {
  if (deviationRatio >= 0.3) {
    return "high";
  }

  if (deviationRatio >= 0.15) {
    return "medium";
  }

  return "low";
};

const buildAbnormalLabAlerts = (labs, patientId) => {
  const alerts = [];

  labs.forEach((lab) => {
    const { low, high } = parseNormalRange(lab.normalRange);
    const value = Number(lab.value);

    if (!Number.isFinite(value) || (!Number.isFinite(low) && !Number.isFinite(high))) {
      return;
    }

    let deviationRatio = 0;
    let relation = "";

    if (Number.isFinite(low) && value < low) {
      deviationRatio = (low - value) / (Math.abs(low) || 1);
      relation = "below";
    } else if (Number.isFinite(high) && value > high) {
      deviationRatio = (value - high) / (Math.abs(high) || 1);
      relation = "above";
    } else {
      return;
    }

    alerts.push({
      patientId,
      type: "abnormal_lab",
      severity: abnormalLabSeverity(deviationRatio),
      message: `${lab.testName} is ${relation} normal range (${value}${lab.unit ? ` ${lab.unit}` : ""}; expected ${lab.normalRange}).`
    });
  });

  return alerts;
};

const buildFollowUpAlerts = (visits, patientId) => {
  const now = new Date();
  const alerts = [];

  visits.forEach((visit) => {
    if (!visit.followUpDate || visit.followUpDate >= now) {
      return;
    }

    const daysOverdue = Math.floor((now.getTime() - visit.followUpDate.getTime()) / (1000 * 60 * 60 * 24));
    const severity = daysOverdue > 30 ? "high" : daysOverdue > 7 ? "medium" : "low";

    alerts.push({
      patientId,
      type: "missed_followup",
      severity,
      message: `Follow-up was due on ${visit.followUpDate.toISOString().slice(0, 10)} (${daysOverdue} day(s) overdue).`
    });
  });

  return alerts;
};

const buildMedicationAlerts = (medications, patientId) => {
  const alerts = [];

  medications.forEach((medication) => {
    if (!["missed", "poor"].includes(medication.adherenceStatus)) {
      return;
    }

    alerts.push({
      patientId,
      type: "medication_adherence",
      severity: medication.adherenceStatus === "poor" ? "high" : "medium",
      message: `Medication adherence issue for ${medication.name}: status is "${medication.adherenceStatus}".`
    });
  });

  return alerts;
};

const rebuildPatientAlerts = async (patientId) => {
  const [labs, visits, medications] = await Promise.all([
    Lab.find({ patientId }).sort({ date: -1 }).lean(),
    Visit.find({ patientId }).sort({ visitDate: -1 }).lean(),
    Medication.find({ patientId }).sort({ createdAt: -1 }).lean()
  ]);

  // Replace old rule-based alerts so the list always reflects current records.
  await Alert.deleteMany({ patientId, type: { $in: RULE_BASED_TYPES } });

  const generatedAlerts = [
    ...buildAbnormalLabAlerts(labs, patientId),
    ...buildFollowUpAlerts(visits, patientId),
    ...buildMedicationAlerts(medications, patientId)
  ];

  if (generatedAlerts.length === 0) {
    return [];
  }

  return Alert.insertMany(generatedAlerts);
};

const getAlertsForPatient = async (patientId) => {
  await rebuildPatientAlerts(patientId);
  return Alert.find({ patientId }).sort({ createdAt: -1 });
};

module.exports = {
  rebuildPatientAlerts,
  getAlertsForPatient
};
