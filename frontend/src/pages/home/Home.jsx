import React from "react";
import './Home.css'
import { Link } from "react-router";

export default function Home() {
   return (
      <div className="home-container">
         <section className="hero-section">
            <div className="hero-text">
               <h1>O melhor site para acompanhar eventos do CIMOL!</h1>
               <p>
                  Informações, valores e dicas sobre os eventos somente aqui!
               </p>
               <Link to='/' className="hero-buttons">
                  <button className="primary-btn">Saber mais</button>
               </Link>
            </div>
         </section>

      <br></br>

         <div className="events">
            <a href="/taquara-summit" className="event-card">
               <img
                  src="https://via.placeholder.com/300"
                  alt="Taquara Summit"
               />
               <h3>Taquara Summit</h3>
               <p>Faccat, Taquara - RS</p>
               <button className="learn-more-btn">Saiba Mais</button>
            </a>
            <a href="/mundo-feevale" className="event-card">
               <img
                  src="https://via.placeholder.com/300"
                  alt="Mundo Feevale"
               />
               <h3>Mundo Feevale</h3>
               <p>Feevale, Novo Hamburgo - RS</p>
               <button className="learn-more-btn">Saiba Mais</button>
            </a>
            <a href="/hackatime" className="event-card">
               <img
                  src="https://via.placeholder.com/300"
                  alt="Hackatime"
               />
               <h3>Hackatime</h3>
               <p>Faccat, Taquara - RS</p>
               <button className="learn-more-btn">Saiba Mais</button>
            </a>
         </div>
      </div>
   );
}