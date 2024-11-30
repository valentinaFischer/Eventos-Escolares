import React, { useState } from "react";
import { Link } from "react-router";
import "./cadastro.css";
import api from "../../../api/api";
import { useSession } from "../../../hooks/useSession";

export default function Signin() {
  const { user, login } = useSession();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [curso, setCurso] = useState("");
  const [numeroMatricula, setNumeroMatricula] = useState("");
  const [tipo_usuario, setTipoUsuario] = useState("visitante");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setErrorMessage("Por favor, preencha todos os campos.");
    } else if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
    } else {
      reqSignin();
      console.log("Cadastro realizado com:", username, email, password);
    }
  };

  async function reqSignin() {
    let data = {
      nome: username,
      senha: password,
      confirmasenha: confirmPassword,
      email,
      tipo_usuario,
    };
    try {
      let res = await api.post("/users/register", data);
      if (res.status == 200 || res.status == 201) {
        return login({
          info: res.data.user,
          token: res.data.token,
        });
      }
    } catch (err) {
      if (err.status == 401) {
        return setErrorMessage("Não autorizado");
      }
      return setErrorMessage("Erro ao cadastrar conta");
    }
  }

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Cadastro</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
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
          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar Senha</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
            />
          </div>
          <div className="input-group">
            <label htmlFor="tipo_usuario">Visitante ou aluno</label>
            <select
              id="tipo_usuario"
              name="tipo_usuario"
              value={tipo_usuario}
              className=""
              onChange={(e) => {
                setTipoUsuario(e.target.value);
              }}
            >
              <option value="visitante">Visitante</option>
              <option value="aluno">Aluno</option>
            </select>
          </div>
          {tipo_usuario == "aluno" && (
            <><div className="input-group">
              <label htmlFor="curso">Selecione seu curso</label>
              <select
                id="curso"
                name="curso"
                value={curso}
                className=""
                onChange={(e) => {
                  setCurso(e.target.value);
                } }
              >
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
            <div className="input-group">
                <label htmlFor="numero_matricula">Número da matrícula</label>
                <input
                  type="text"
                  id="numero_matricula"
                  value={numeroMatricula}
                  onChange={(e) => setNumeroMatricula(e.target.value)}
                  placeholder="Digite seu número de matrícula" />
              </div></>
          )}
          <button type="submit" className="btn-signup">
            Cadastrar
          </button>
        </form>

        <div className="login-link">
          <p>
            <Link to="/login" replace className="login-link-text">
              Já tem uma conta?{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
