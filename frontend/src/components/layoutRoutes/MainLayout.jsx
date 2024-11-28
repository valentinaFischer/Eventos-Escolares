import React from "react";
import { Link, Outlet, useNavigate, useNavigation } from "react-router";
import { Search } from "lucide-react";

export default function MainLayout() {
  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Link to="/" className="text-2xl font-bold text-[#2D2B4E]">
          EVA
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            to="/home"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Início
          </Link>
          <Link
            to="/events"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Eventos
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Inscrições
          </Link>

          <Link
            to="/profile"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Perfil
          </Link>
        </nav>

        <div className="flex items-center justify-center">
          <button
            className="rounded-full md:mr-2 p-2 hover:bg-gray-100"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <Link
            to="/login"
            className="inline-block ml-4 px-5 py-2 font-medium rounded-lg bg-blue-600 text-white"
          >
            Entrar
          </Link>
        </div>
      </header>
      <Outlet /> {/* aqui vai ser onde vai os filho */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="footer-box">
              <h3 className="text-xl font-bold mb-4">Local</h3>
              <p className="text-gray-300">
                CIMOL - Rua Guilherme Lahm, 1778 - Taquara/RS
              </p>
            </div>
            <div className="footer-box">
              <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition"
                >
                  Início
                </Link>
                <Link
                  to="/events"
                  className="text-gray-300 hover:text-white transition"
                >
                  Eventos
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white transition"
                >
                  Perfil
                </Link>
              </nav>
            </div>
            <div className="footer-box">
              <h3 className="text-xl font-bold mb-4">Contatos</h3>
              <p className="text-gray-300">(51) 3542-1309</p>
              <p className="text-gray-300">candido-lfarias@educar.rs.gov.br</p>
              <p className="text-gray-300">cimol@cimol.g12.br</p>
            </div>
            <div className="footer-box">
              <h3 className="text-xl font-bold mb-4">Social</h3>
              <nav className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          Copyright @ 2024 por{" "}
          <span className="font-semibold">Eventos Cimol</span>
        </div>
      </footer>   
    </>
  );
}
