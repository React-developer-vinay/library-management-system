// backend/utils/calculateFine.js
module.exports = function calculateFine(plannedReturn, actualReturn) {
  const perDay = Number(process.env.FINE_PER_DAY || 5);
  const diffMs = actualReturn - plannedReturn;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * perDay : 0;
};
