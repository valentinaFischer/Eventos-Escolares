import React, { useState } from "react";
import { Link } from "react-router";
import "./login.css";
import api from "../../../api/api";
import { useSession } from "../../../hooks/useSession";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useSession();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setErrorMessage("Por favor, preencha todos os campos.");
    } else {
      reqLogin({ email, senha: password });
    }
  };

  async function reqLogin({ email, senha }) {
    let data = {
      email,
      senha,
    };

    let res;
    /*  
     res.data = {
       "message": "Você está logado(a)",
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiZXJuZXN0byIsImlkIjo1LCJ0aXBvX3VzdWFyaW8iOiJhZG1pbiIsIm1hdHJpY3VsYSI6bnVsbCwiY3Vyc28iOm51bGwsImVtYWlsIjoiaW5mbzJAaG90bWFpbC5jb20iLCJpYXQiOjE3MzI4MzkyMDR9.-2TwMM0CdA8YhadZCzUc13351DBqeKOnByC9YeBRi18",
       "user": {
         "nome": "ernesto",
         "id": 5,
         "tipo_usuario": "admin",
         "matricula": null,
         "curso": null,
         "email": "info2@hotmail.com"
       }
     }

     */
    try {
      res = await api.post("/users/login", data);
      if (res && res.status == 200) {
        return await login({
          info: res.data.user,
          token: res.data.token,
        });
      }
    } catch (err) {
      if (err.status == 422) {
        return setErrorMessage("Senha incorreta");
      }
      return setErrorMessage("Erro ao fazer login, cheque suas credenciais");
    }
  }

  return (
    <div className="login-container">
      {/* Formulário de login */}
      <div className="login-box">
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Usuário</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>
          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>

        {/* Link de cadastro abaixo do botão de login */}
        <div className="signup-link">
          <p>
            {" "}
            <Link to="/signin" replace className="signup-link-text">
              Não tem uma conta?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
