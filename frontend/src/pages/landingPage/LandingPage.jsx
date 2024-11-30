import React from "react";
import './LandingPage.css';

export default function LandingPage() {
  return (
    <>
      <main id="content">
        <section id="home">
          <div className="shape"></div>
          <div id="cta">
            <h1 className="title">Eventos<span> CIMOL</span></h1>
            <p className="description">
              O melhor site de eventos de CIMOL! Informações, valores e dicas sobre os eventos,
              somente aqui!
            </p>
            <div id="cta_buttons">
              <a href="#" className="btn-default">Ver eventos</a>
              <a href="tel:+55555555555" id="phone_button">
                <button className="btn-default">
                  <i className="fa-solid fa-phone"></i>
                </button>
                (51) 92342-3243
              </a>
            </div>
            <div className="social-media-buttons">
              <a href="">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="">
                <i className="fa-brands fa-facebook"></i>
              </a>
            </div>
          </div>
          <div id="banner">
            <img src="src/images/hero.png" alt="" />
          </div>
        </section>
        <section id="menu">
          <h2 className="section-title">Eventos</h2>
          <h3 className="section-subtitle">Nossos eventos</h3>
          <div id="dishes">
            {/* Substitua os itens abaixo por um .map se quiser usar um array para renderizar dinamicamente */}
            <div className="dish">
              <div className="dish-heart">
                <i className="fa-solid fa-heart"></i>
              </div>
              <img src="src/images/dish.png" className="dish-image" alt="" />
              <h3 className="dish-title">Lorem Ipsum</h3>
              <span className="dish-description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </span>
              <div className="dish-rate">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <span>(500+)</span>
              </div>
              <div className="dish-price">
                <h4>R$20,00</h4>
                <button className="btn-default">
                  <i className="fa-solid fa-basket-shopping"></i>
                </button>
              </div>
            </div>
            {/* Repita outros itens aqui */}
          </div>
        </section>
        <section id="testimonials">
          <img src="src/images/guri.png" id="testimonial_chef" alt="" />
          <div id="testimonials_content">
            <h2 className="section-title">Depoimentos</h2>
            <h3 className="section-subtitle">
              O que os clientes falam sobre nós
            </h3>
            <div id="feedbacks">
              <div className="feedback">
                <img src="src/images/avatar.png" className="feedback-avatar" alt="" />
                <div className="feedback-content">
                  <p>
                    Fulana de Tal
                    <span>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  </p>
                  <p>
                    "Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Repellat voluptatibus cumque dolor ea est quae alias necessitatibus"
                  </p>
                </div>
              </div>
            </div>
            <button className="btn-default">Ver mais avaliações</button>
          </div>
        </section>
      </main>
    </>
  );
}