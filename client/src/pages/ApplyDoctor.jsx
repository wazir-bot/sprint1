import React, { useState } from "react";
import "../styles/contact.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Set base URL for Axios
axios.defaults.baseURL =
  process.env.REACT_APP_SERVER_DOMAIN || "http://localhost:5015/api";

const ApplyDoctor = () => {
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const btnClick = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formDetails.specialization || !formDetails.experience || !formDetails.fees) {
      toast.error("Please fill out all fields");
      return;
    }

    // Prepare payload with parsed numbers
    const payload = {
      specialization: formDetails.specialization,
      experience: parseInt(formDetails.experience, 10),
      fees: parseInt(formDetails.fees, 10),
    };

    try {
      await toast.promise(
        axios.post("/doctor/applyfordoctor", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        {
          loading: "Sending doctor application...",
          success: "Doctor application sent successfully",
          error: "Unable to send doctor application",
        }
      );

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center apply-doctor" id="contact">
        <div className="register-container flex-center contact">
          <h2 className="form-heading">Apply for Doctor</h2>
          <form className="register-form" onSubmit={btnClick}>
            <input
              type="text"
              name="specialization"
              className="form-input"
              placeholder="Enter your specialization"
              value={formDetails.specialization}
              onChange={inputChange}
            />
            <input
              type="number"
              name="experience"
              className="form-input"
              placeholder="Enter your experience (in years)"
              value={formDetails.experience}
              onChange={inputChange}
            />
            <input
              type="number"
              name="fees"
              className="form-input"
              placeholder="Enter your fees (in dollars)"
              value={formDetails.fees}
              onChange={inputChange}
            />
            <button type="submit" className="btn form-btn">
              Apply
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ApplyDoctor;
