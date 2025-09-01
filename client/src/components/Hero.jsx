import React from "react";
import image from "../images/dc.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          APPOINTIFY, <br />
          Easy appointment
        </h1>
        <p>
        Welcome to APPOINTIFY, your trusted partner in booking doctor appointments easily and efficiently. We connect you with healthcare professionals across various specialties, ensuring you get the care you need, when you need it. Our user-friendly platform 
        allows you to schedule appointments and access important health information—all in one place. Prioritize your health today with APPOINTIFY!
        </p>
      </div>
      <div className="hero-img">
        <img
          src={image}
          alt="hero"
        />
      </div>
    </section>
  );
};

export default Hero;
