export function removeTime(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
