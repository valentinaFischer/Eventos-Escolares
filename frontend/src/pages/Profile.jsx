import React, { useEffect, useState } from "react";
import { useSession } from "../hooks/useSession";
import { useNavigate, useParams } from "react-router";
import api from "../api/api";


export default function Profile(){

   const { id } = useParams();
   const { user, logout } = useSession();
   const navigate = useNavigate();

   const [userData, setUserData] = useState(null);

   // const [userUpdateData, setUpdateData] = useState({
   //    nome: '',
   //    email: '',
   // });

   useEffect( () => {
      if(!user){
         navigate('/')
      } else {
         fetchUser();
      }
   }, [])

   async function fetchUser(){
      let res;
      let headers = {
         'Authorization': 'Bearer '+ user.token
      }
      if(user.info.tipo == 'admin' && id){
         res = await api.get('/admin/users/'+id, { headers });
      } else {
         res = await api.get('/users/me', { headers });
      }

      if(res.status == 200){
         setUserData(res.data);
      } else {
         navigate('/');
      }
   }

   if(!user) return <></>

   if(userData == null){
      return <div>
         <p>
            procurando usuario...
         </p>
      </div>
   }
   return <>
      <div>
         <p>
            Perfil: apresentação diferente para:

            - admin vendo um perfil d usuario
            - usuario vendo o proprio perfil

            se id existe, é um admin vendo um perfil,
            se o user.info.id == userData.id é um usuario vendo o proprio perfil,
         </p>
      </div>
   </>
}