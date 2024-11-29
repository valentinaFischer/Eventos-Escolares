import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api/api";
import { useSession } from "../hooks/useSession";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useSession();
  const [evento, setEvento] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      let res = await api.get(`/users/eventos/${id}`, {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });

      if (res.status === 200) {
        setEvento(res.data);
        setIsRegistered(
          res.data.Registrations.some((reg) => reg.user_id === user.info.id)
        );
      } else {
        navigate("/events");
      }
    } catch (err) {
      console.error(err);
      navigate("/events");
    }
  };

  const handleRegistration = async () => {
    if (isRegistered) return;

    setIsRegistering(true);
    try {
      const res = await api.put(
        `/events/registration/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      if (res.status === 200) {
        setIsRegistered(true);
        await fetchEventDetails(); // Refresh event details to update registrations
      }
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsRegistering(false);
    }
  };

  if (evento == null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Hero Section */}
      <div className="w-full flex flex-col md:flex-row mb-8">
        <div className="relative w-full md:w-1/2 md:pr-5">
          <img
            src={evento.caminho_imagem}
            alt={"Imagem do evento: " + evento.nome}
            className="w-full aspect-[16/9] bg-black object-cover rounded-lg"
          />
          <div className="absolute inset-0" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col p-5">
          <div className="space-y-4 mb-10">
            <h1 className="text-4xl text-left font-bold text-gray-900">
              {evento.nome}
            </h1>
            <p className="text-xl text-left text-gray-600">
              {evento.localizacao}
            </p>
            <p className="text-lg text-left text-gray-700">
              <span className="font-semibold">Data e Hora:</span>{" "}
              {formatDate(evento.data_horario)}
            </p>
            <p className="text-lg text-left text-gray-700">
              <span className="font-semibold">Público Alvo:</span>{" "}
              {evento.publico_alvo.replace(/_/g, " ")}
            </p>
            {evento.curso_necessario && (
              <p className="text-lg text-left text-gray-700">
                <span className="font-semibold">Curso Necessário:</span>{" "}
                {evento.curso_necessario}
              </p>
            )}
            <p className="text-lg text-left">
              <span className="font-semibold">Tipo de Evento:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm ${
                  evento.tipo_evento === "nao_pago"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {evento.tipo_evento === "nao_pago" ? "Gratuito" : "Pago"}
              </span>
            </p>
            {evento.tipo_evento == "pago" && (
              <p className="text-sm text-left text-gray-900">{evento.preco}</p>
            )}
          </div>

          <div className="mt-auto">
            <button
              className={`w-full px-8 py-3 rounded-full text-lg font-semibold transition-colors ${
                isRegistered
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handleRegistration}
              disabled={isRegistered || isRegistering}
            >
              {isRegistering
                ? "Processando..."
                : isRegistered
                ? "Inscrito no evento"
                : "Inscreva-se já!"}
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="prose max-w-none mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Descrição do Evento
        </h2>
        {evento.descricao.split("\n").map((paragraph, index) => (
          <p key={index} className="text-gray-700 text-lg leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Registrations */}
      {user.info.tipo_usuario == "admin" && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Inscrições</h2>
          <div className="space-y-4">
            {evento.Registrations.length === 0 ? (
              <p className="text-gray-600 text-lg">
                Nenhuma inscrição registrada.
              </p>
            ) : (
              evento.Registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
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
                      <p className="font-semibold text-gray-900">
                        {registration.User.nome},{" "}
                        {registration.User.tipo_usuario}
                      </p>
                      <p className="text-gray-600">{registration.User.email}</p>
                      <p className="text-gray-600">
                        Inscrição: {formatDate(registration.createdAt)}
                      </p>
                      <p className="text-gray-600">
                        Status: {registration.status_pagamento}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
