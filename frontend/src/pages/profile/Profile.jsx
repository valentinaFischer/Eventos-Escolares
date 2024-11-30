import React, { useEffect, useState } from "react";
import { useSession } from "../../hooks/useSession";
import { useNavigate, useParams } from "react-router";
import api from "../../api/api";
import "./Profile.css"; // Importe o CSS para o estilo

export default function Profile() {
   const { id } = useParams();
   const { user, logout } = useSession();
   const navigate = useNavigate();

   const [userData, setUserData] = useState(null);

   useEffect(() => {
      if (!user) {
         navigate("/");
      } else {
         fetchUser();
      }
   }, []);

   async function fetchUser() {
      let res;
      let headers = {
         Authorization: "Bearer " + user.token
      };
      if (user.info.tipo === "admin" && id) {
         res = await api.get("/admin/users/" + id, { headers });
      } else {
         res = await api.get("/users/me", { headers });
      }

      if (res.status == 200) {
         setUserData(res.data);
      } else {
         navigate("/");
      }
   }

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData((prevData) => ({
         ...prevData,
         [name]: value
      }));
   };

   if (!user) return <></>;

   if (userData == null) {
      return (
         <div>
            <p>Procurando usuário...</p>
         </div>
      );
   }

   return (
      <div className="profile-container">
         <div className="profile-sidebar">
            <h1>Usuário</h1>
         </div>
         <div className="profile-content">
            <h1>Usuário</h1>
            <div className="profile-field">
               <label>Nome completo</label>
               <input
                  type="text"
                  name="nome"
                  value={userData.nome}
                  onChange={handleChange}
               />
            </div>
            <div className="profile-field">
               <label>Email</label>
               <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
               />
            </div>
            <div className="profile-field">
               <label>Telefone</label>
               <input
                  type="text"
                  name="telefone"
                  value={userData.telefone}
                  onChange={handleChange}
               />
            </div>
            <div className="profile-field">
               <label>Endereço</label>
               <input
                  type="text"
                  name="endereco"
                  value={userData.endereco}
                  onChange={handleChange}
               />
            </div>
         </div>
      </div>
   );
}