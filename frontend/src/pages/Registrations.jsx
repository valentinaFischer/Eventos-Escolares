import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loader } from 'lucide-react';
import api from "../api/api";
import { useSession } from "../hooks/useSession";

export default function Registrations() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const res = await api.get('/users/eventos', {
        headers: {
          'Authorization': 'Bearer ' + user.token
        }
      });
      if (res.status === 200) {
        const userEvents = res.data.eventos.filter(evento => 
          evento.Registrations.some(reg => reg.user_id === user.info.id)
        );
        setRegisteredEvents(userEvents);
      }
    } catch (err) {
      console.error("Failed to fetch registered events:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Meus Eventos Registrados</h1>
      {registeredEvents.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Você ainda não está inscrito em nenhum evento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((evento) => {
            const userRegistration = evento.Registrations.find(reg => reg.user_id === user.info.id);
            return (
              <div key={evento.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <img src={`http://localhost:5000/${evento.caminho_imagem}`} alt={evento.nome} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{evento.nome}</h3>
                  <p className="text-gray-600 mb-4">{evento.descricao}</p>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium text-gray-700">Data e Hora:</span> {formatDate(evento.data_horario)}</p>
                    <p className="text-sm"><span className="font-medium text-gray-700">Localização:</span> {evento.localizacao}</p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Tipo de Evento:</span>
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${evento.tipo_evento === 'nao_pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {evento.tipo_evento === 'nao_pago' ? 'Gratuito' : 'Pago'}
                      </span>
                    </p>
                    <p className="text-sm"><span className="font-medium text-gray-700">Público Alvo:</span> {evento.publico_alvo.replace(/_/g, ' ')}</p>
                    {evento.curso_necessario && (
                      <p className="text-sm"><span className="font-medium text-gray-700">Curso Necessário:</span> {evento.curso_necessario}</p>
                    )}
                    <p className="text-sm"><span className="font-medium text-gray-700">Data de Inscrição:</span> {formatDate(userRegistration.createdAt)}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/events/${evento.id}`)}
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}