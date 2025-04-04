import moment from "moment";

export const formatDateWithMoment = (dateString) => {
  if (!dateString) return "";
  return moment(dateString, "DD-MM-YYYY").format("DD-MMMM-YYYY");
};

export const dateConvert = (isoString)=>{
  
  if(!isoString) return "";
  
  return moment(isoString).format("YYYY-MM-DD") 
}

export const convertISODate = (string)=>{
  if(!string) return "";
  return moment(string).format("DD-MMMM-YYYY")
}


export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};