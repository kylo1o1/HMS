
const checkAvailability = async (date,slots)=>{

  const day = new Date(date).toLocaleString('en-US',{weekday:"long"})


  return slots.map((slot)=>{
    slot.day === day
  })

}

module.exports = {
  checkAvailability
}