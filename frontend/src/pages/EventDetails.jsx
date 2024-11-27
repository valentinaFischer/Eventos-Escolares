import { Loader } from 'lucide-react'
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router';
import api from '../api/api';
import { useSession } from '../hooks/useSession';

export default function EventDetails(){
   const { id } =  useParams();
   const { user } = useSession();
   const [evento, setEvento] = useState(null);
   const navigate = useNavigate();

   useEffect( () => {
      (async () => {
         try{
            let res = await api.get(`/users/eventos/${id}`, {
               headers: { 
                  'Authorization': "Bearer "+ user.token
               }      
            })

            if(res.status == 200){
               console.log(res.data)
               return setEvento(res.data);
            } else return navigate('/events')
         } catch(err){
            return navigate('/events')
         }
      })();
   },[])


   if(evento == null){
      return <div>
         <Loader width={25} height={25}/>
      </div>
   }
   return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Hero Section */}
      <div className='w-full flex flex-col md:flex-row mb-8'>
         <div className="relative w-full md:w-1/2 md:pr-5">
           <img
             src={"http://localhost:5000/"+ evento.caminho_imagem}
             alt={"Imagem do evento: "+evento.nome}
             className="w-full aspect-[16/9] bg-black object-cover rounded-lg"
           />
           <div className="absolute inset-0" />
         </div>

         <div className='w-full md:w-1/2 flex flex-col p-5'>
            <div className="space-y-4 mb-10">
               <h1 className="text-4xl text-left font-bold text-gray-900">{evento.nome}</h1>
               <p className="text-xl text-left text-gray-600">{evento.localizacao}</p>
               { 
                  evento.tipo_evento == 'pago'? 
                  <p className='text-sm text-left text-gray-900'>{evento.preco}</p>
                  :<></>
               }
            </div>

            <div className="mt-auto">
               <button className="bg-blue-600 w-full text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
                   Inscreva-se já!
               </button>
            </div>
         </div>
      </div>

      {/* Description */}
      <div className="prose max-w-none mb-8">
        {evento.descricao.split('\n').map( paragraph =>{
         return <p className="text-gray-700 text-lg leading-relaxed">
          {paragraph}
        </p>
        })}
      </div>

      {/* Registrations
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Inscrições</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Maria', age: '20 anos', date: '30/11/2024' },
            { name: 'João', age: '16 anos', date: '30/11/2024' },
            { name: 'Ricardo', age: '46 anos', date: '30/11/2024' },
          ].map((person, index) => (
            <div
              key={index}
              className="bg-yellow-100 p-6 rounded-lg flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{person.name}, {person.age}</p>
                <p className="text-gray-600">{person.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

