module.exports = (patient, medications, visits) => {
  const activeMeds = medications.filter(m => m.active);

  const lastVisit = visits.length
    ? visits.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
    : "No visits";

  return {
    age: patient.age,
    conditions: patient.conditions,
    allergies: patient.allergies,
    activeMedications: activeMeds.length,
    lastVisit
  };
};
