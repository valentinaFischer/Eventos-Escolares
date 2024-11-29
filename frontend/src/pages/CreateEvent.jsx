import React, { useState } from "react";
import { useSession } from "../hooks/useSession";
import api from "../api/api";

export default function CreateEvent() {
  const { user } = useSession();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data_horario: "",
    localizacao: "",
    tipo_evento: "nao_pago",
    publico_alvo: "todos",
    curso_necessario: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();

    // Append all form fields to FormData
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    // Append the image if it exists
    if (image) {
      submitData.append("event_image", image);
    } else {
      alert("É necessário inserir uma imagem");
    }

    try {
      const response = await api.post("/admin/createEvent", submitData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201 || response.status === 200) {
        alert("Evento criado com sucesso!");
        // Reset form or redirect
      }
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      alert("Erro ao criar evento. Por favor, tente novamente.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Criar Novo Evento</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do Evento
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="data_horario"
            className="block text-sm font-medium text-gray-700"
          >
            Data e Hora
          </label>
          <input
            type="datetime-local"
            id="data_horario"
            name="data_horario"
            value={formData.data_horario}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="localizacao"
            className="block text-sm font-medium text-gray-700"
          >
            Localização
          </label>
          <input
            type="text"
            id="localizacao"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700">
            Tipo de Evento
          </span>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipo_evento"
                value="nao_pago"
                checked={formData.tipo_evento === "nao_pago"}
                onChange={handleChange}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Gratuito</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipo_evento"
                value="pago"
                checked={formData.tipo_evento === "pago"}
                onChange={handleChange}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Pago</span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="publico_alvo"
            className="block text-sm font-medium text-gray-700"
          >
            Público Alvo
          </label>
          <select
            id="publico_alvo"
            name="publico_alvo"
            value={formData.publico_alvo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="todos">Todos</option>
            <option value="somente_alunos">Somente Alunos</option>
            <option value="alunos_curso_especifico">
              Alunos de Curso Específico
            </option>
          </select>
        </div>

         {
            formData.publico_alvo != 'todos' &&        <div>
            <label
              htmlFor="curso_necessario"
              className="block text-sm font-medium text-gray-700"
            >
              Curso Necessário
            </label>
            <select
              id="curso_necessario"
              name="curso_necessario"
              value={formData.curso_necessario}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Nenhum</option>
              <option value="informatica">Informática</option>
              <option value="moveis">Móveis</option>
              <option value="mecanica">Mecânica</option>
              <option value="design_de_moveis">Design de Móveis</option>
              <option value="eletronica">Eletrônica</option>
              <option value="eletrotecnica">Eletrotécnica</option>
              <option value="quimica">Química</option>
              <option value="meio_ambiente">Meio Ambiente</option>
            </select>
          </div>
  
         }
        <div>
          <label
            htmlFor="imagem"
            className="block text-sm font-medium text-gray-700"
          >
            Imagem do Evento
          </label>
          <input
            type="file"
            id="imagem"
            name="imagem"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto max-h-48 rounded"
              />
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Criar Evento
          </button>
        </div>
      </form>
    </div>
  );
}
