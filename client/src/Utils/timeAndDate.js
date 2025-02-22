

const getNext7Days = ()=>{
    const daysOfWeek = [
    { full: "Sunday", short: "Sun" },
    { full: "Monday", short: "Mon" },
    { full: "Tuesday", short: "Tue" },
    { full: "Wednesday", short: "Wed" },
    { full: "Thursday", short: "Thu" },
    { full: "Friday", short: "Fri" },
    { full: "Saturday", short: "Sat" }
    ]
    let days=[];
    let today = new Date();
    for (let i = 0; i < 7; i++) {
        let nextDay = new Date();
        nextDay.setDate(today.getDate() + i);
        
        let dayInfo = daysOfWeek[nextDay.getDay()];
        
        days.push({
          fullDay: dayInfo.full,
          shortDay: dayInfo.short,
          date: nextDay.getDate(),
        });
      }
    return days
}
const getTimeRange = (startHour,endHour) => {
  let times = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute of [0, 30]) {
      let period = hour < 12 ? "AM" : "PM";
      let formattedHour = hour > 12 ? hour - 12 : hour;
      times.push(`${formattedHour}:${minute === 0 ? "00" : "30"} ${period}`);
    }
  }
  return times;
};

module.exports = {getNext7Days,getTimeRange}