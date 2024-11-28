import React, { useState } from 'react'
import { Link } from 'react-router'
import './login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === '' || password === '') {
      setErrorMessage('Por favor, preencha todos os campos.')
    } else {
      
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
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
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
          <button type="submit" className="btn-login">Entrar</button>
        </form>

        {/* Link de cadastro abaixo do botão de login */}
        <div className="signup-link">
          <p> <Link to="/signin" replace className="signup-link-text">Não tem uma conta?</Link></p>
        </div>
      </div>
    </div>
  )
}
