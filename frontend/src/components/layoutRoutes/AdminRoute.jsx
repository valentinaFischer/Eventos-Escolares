import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSession } from "../../hooks/useSession";

export default function AdminRoute(){
   const { user } = useSession(); // depois é pra testar se é admin ou não de verdade
   const isAdmin = (user.info.tipo_usuario == 'admin'); 

   if(!isAdmin) return <Navigate to={'/home'}/>
   return <Outlet /> 
}