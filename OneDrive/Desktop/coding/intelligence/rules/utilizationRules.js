module.exports = (visits) => {
  if (visits.length > 3) {
    return [{
      type: "high-utilization",
      message: "Frequent recent visits"
    }];
  }
  return [];
};
