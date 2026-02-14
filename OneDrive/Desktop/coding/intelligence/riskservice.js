module.exports = (patient, medications, visits) => {
  let score = 0;

  score += patient.conditions.length;
  score += medications.filter(m => m.active).length;
  score += visits.length;

  if (score > 6) return "high";
  if (score > 3) return "medium";
  return "low";
};
