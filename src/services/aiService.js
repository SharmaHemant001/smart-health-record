const axios = require("axios");
const { aiApiUrl } = require("../config/env");

const buildFallbackSummary = ({ patient, medications, visits, labs, alerts }) => {
  const activeMedications = medications.filter((medication) => {
    return !medication.endDate || new Date(medication.endDate) >= new Date();
  });
  const latestVisit = visits[0];
  const latestLabs = labs.slice(0, 3);
  const topAlerts = alerts.slice(0, 3);

  const sections = [
    `Patient ${patient.name}, ${patient.age} year(s), ${patient.gender}, blood group ${patient.bloodGroup}.`,
    `Chronic conditions: ${patient.chronicConditions.length ? patient.chronicConditions.join(", ") : "none recorded"}.`,
    `Allergies: ${patient.allergies.length ? patient.allergies.join(", ") : "none recorded"}.`,
    `Active medications: ${activeMedications.length ? activeMedications.map((item) => `${item.name} (${item.dosage}, ${item.frequency})`).join("; ") : "none recorded"}.`,
    `Latest visit: ${latestVisit ? `${latestVisit.visitDate.toISOString().slice(0, 10)} diagnosis "${latestVisit.diagnosis}"` : "no visits recorded"}.`,
    `Recent labs: ${latestLabs.length ? latestLabs.map((lab) => `${lab.testName} ${lab.value}${lab.unit ? ` ${lab.unit}` : ""} (range ${lab.normalRange || "n/a"})`).join("; ") : "no labs recorded"}.`,
    `Current alerts: ${topAlerts.length ? topAlerts.map((alert) => `${alert.severity} ${alert.type.replace("_", " ")} - ${alert.message}`).join("; ") : "no active alerts"}.`
  ];

  return sections.join(" ");
};

const generateClinicalSummary = async ({ patient, medications, visits, labs, alerts }) => {
  const payload = {
    patient,
    medications,
    visits,
    labs,
    alerts
  };

  try {
    const response = await axios.post(`${aiApiUrl}/generate-summary`, payload, {
      timeout: 8000
    });

    if (response?.data?.summaryText && typeof response.data.summaryText === "string") {
      return response.data.summaryText;
    }

    if (response?.data?.summary && typeof response.data.summary === "string") {
      return response.data.summary;
    }
  } catch (error) {
    // Fallback keeps the endpoint usable if the external service is unavailable.
  }

  return buildFallbackSummary({ patient, medications, visits, labs, alerts });
};

module.exports = {
  generateClinicalSummary
};
