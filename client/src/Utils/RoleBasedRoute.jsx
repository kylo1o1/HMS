import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RoleBasedRoute = ({allowedRoles,children}) => {

    const {user} = useSelector((state)=>state?.auth?? [])
    const navigate = useNavigate();

    if(user && allowedRoles.includes(user.role)){
        return children
    }
    
    toast.error("Unauthorized access!",{
        autoClose:3000
    })
    setTimeout(()=>{
        navigate('/')
    },3000)
   
};

export default RoleBasedRoute;
