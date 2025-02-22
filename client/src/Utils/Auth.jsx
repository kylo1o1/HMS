import React from "react";
import { Navigate } from "react-router-dom";

const Auth = ({isAuthenticated,children}) => {
    
        if(!isAuthenticated){
            return <Navigate to={'/login'}/>
        }
        return children


        
};

export default Auth;
