import moment from "moment";
import { string } from "yup";

export const formatDateWithMoment = (dateString) => {
  if (!dateString) return "";
  return moment(dateString, "DD-MM-YYYY").format("DD-MMMM-YYYY");
};

export const dateConvert = (isoString)=>{
  
  if(!isoString) return "";
  
  return moment(isoString).format("YYYY-MM-DD") 
}