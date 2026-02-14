const buildSnapshot = require("./snapshotservice");
const generateAlerts = require("./alertservice");
const calculateRisk = require("./riskservice");
const buildSummary = require("./summaryservice");

const runIntelligence = ({ patient, medications, visits }) => {
  const snapshot = buildSnapshot(patient, medications, visits);
  const alerts = generateAlerts(patient, medications, visits);
  const risk = calculateRisk(patient, medications, visits);
  const summary = buildSummary(patient, medications, visits);

  return { snapshot, alerts, risk, summary };
};

module.exports = runIntelligence;
