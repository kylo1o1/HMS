const moment = require("moment");

const getNext7Days = () => {
  return Array.from({ length: 7 }, (_, i) => {
    let date = moment().add(i, "days");
    return {
      fullDay: date.format("dddd"), 
      shortDay: date.format("ddd"), 
      date: date.date(),
      formattedDate: date.format("DD-MM-YYYY")
    };
  });
};


const getTimeRange = (startTime, endTime) => {
  let times = [];
  let start = moment(startTime, "HH:mm"); // Parse start time
  let end = moment(endTime, "HH:mm"); // Parse end time

  while (start.isSameOrBefore(end)) {
    times.push(start.format("h:mm A")); // Format time as "5:30 AM"
    start.add(30, "minutes"); // Increment by 30 minutes
  }

  return times;
};



module.exports = { getNext7Days, getTimeRange };
