module.exports = (patient, medications, visits) => {
  return `${patient.age} year old patient with 
  ${patient.conditions.join(", ")}.
  Currently on ${medications.length} medications 
  with ${visits.length} recorded visits.`;
};
