import React from "react";
import image from "../images/images.jpeg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img
              src={image}
              alt="hero"
            />
          </div>
          <div className="hero-content">
            <p>
            Welcome to APPOINTIFY, your go-to platform for selecting the right doctor and booking appointments at your convenience.
             Our website allows you to browse through a wide range of healthcare professionals across various specialties, 
             helping you find the perfect match for your medical needs. With a simple registration process, you can create 
             a secure patient profile using your unique ID and password, making it easy to manage appointments, track your
              health history, and stay connected with your healthcare provider. At APPOINTIFY,
             we’re committed to making healthcare more accessible, efficient, and personalized, so you can focus on what matters most—your health.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
