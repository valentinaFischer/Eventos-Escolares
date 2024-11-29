import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useSession } from "../hooks/useSession";
import { Link } from "react-router";

export default function Events() {
  const [eventos, setEventos] = useState(null);
  const { user } = useSession();

  useEffect(() => {
    fetchEventos();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  async function fetchEventos() {
    try {
      let res = await api.get("/users/eventos", {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });
      if (res.status == 200) {
        return setEventos(res.data.eventos);
      }
      return setEventos(false);
    } catch (err) {
      console.error(err.status);
    }
  }

  if (eventos == null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600">
          Carregando eventos...
        </p>
      </div>
    );
  }

  if (!eventos) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">
          Erro ao procurar eventos, recarregue a página
        </p>
      </div>
    );
  }

  if (eventos.length <= 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600">
          Nenhum evento encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Lista de Eventos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <Link to={"/events/"+evento.id}>
            <div
              key={evento.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img
                src={evento.caminho_imagem}
                alt={evento.nome}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {evento.nome}
                </h3>
                <p className="text-gray-600 mb-4">{evento.descricao}</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      Data e Hora:
                    </span>{" "}
                    {formatDate(evento.data_horario)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      Localização:
                    </span>{" "}
                    {evento.localizacao}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      Tipo de Evento:
                    </span>
                    <span
                      className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        evento.tipo_evento === "nao_pago"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {evento.tipo_evento === "nao_pago" ? "Gratuito" : "Pago"}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      Público Alvo:
                    </span>{" "}
                    {evento.publico_alvo.replace(/_/g, " ")}
                  </p>
                  {evento.curso_necessario && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">
                        Curso Necessário:
                      </span>{" "}
                      {evento.curso_necessario}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
