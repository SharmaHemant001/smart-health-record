const medRules = require("./rules/medicationrules");
const followupRules = require("./rules/followRules");
const utilizationRules = require("./rules/utilizationRules");

module.exports = (patient, medications, visits) => {
  return [
    ...medRules(patient, medications),
    ...followupRules(patient, visits),
    ...utilizationRules(visits)
  ];
};
