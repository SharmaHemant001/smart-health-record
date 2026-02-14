module.exports = (patient, medications) => {
  const alerts = [];

  const names = medications.map(m => m.name.toLowerCase());

  if (names.includes("warfarin") && names.includes("aspirin")) {
    alerts.push({
      type: "drug-interaction",
      message: "Possible bleeding risk: Warfarin + Aspirin"
    });
  }

  if (patient.allergies.includes("penicillin") &&
      names.includes("amoxicillin")) {
    alerts.push({
      type: "allergy",
      message: "Allergy conflict detected"
    });
  }

  return alerts;
};
