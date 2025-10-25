const moment = require('moment');

const getToday = () => {
  return moment().format('YYYY-MM-DD');
};

const getWeekDates = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    dates.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
  }
  return dates;
};

const getMonthDates = (year, month) => {
  const startDate = moment(`${year}-${month}-01`);
  const endDate = startDate.clone().endOf('month');
  return {
    start: startDate.format('YYYY-MM-DD'),
    end: endDate.format('YYYY-MM-DD')
  };
};

const getDayName = (date) => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[moment(date).day()];
};

const isToday = (date) => {
  return moment(date).isSame(moment(), 'day');
};

const isFutureDate = (date) => {
  return moment(date).isAfter(moment(), 'day');
};

module.exports = {
  getToday,
  getWeekDates,
  getMonthDates,
  getDayName,
  isToday,
  isFutureDate
};