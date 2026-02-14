module.exports = (patient, visits) => {
  const alerts = [];

  if (!visits.length) return alerts;

  const lastVisit = new Date(
    visits.sort((a,b)=> new Date(b.date)-new Date(a.date))[0].date
  );

  const months =
    (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (months > 6) {
    alerts.push({
      type: "followup",
      message: "No visit in the last 6 months"
    });
  }

  return alerts;
};
