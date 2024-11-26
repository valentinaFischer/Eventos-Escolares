import React from "react";
import { Navigate, Outlet } from "react-router";

export default function AdminRoute(){
   const isAdmin = false; // depois é pra testar se é admin ou não de verdade

   if(!isAdmin) return <Navigate to={'/home'}/>
   return <Outlet /> 
}