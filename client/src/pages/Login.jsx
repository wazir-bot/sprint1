// src/pages/Login.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import fetchData from "../helper/apiCall";
import Navbar from "../components/Navbar";
import "../styles/register.css";

// Ensure axios baseURL is set (env or sensible default)
axios.defaults.baseURL =
  process.env.REACT_APP_SERVER_DOMAIN || "http://localhost:5015/api";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "", // "Admin" | "Doctor" | "Patient"
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const fetchAndStoreUser = async (token) => {
    try {
      const { userId } = jwt_decode(token);
      const data = await fetchData(`/user/getuser/${userId}`);
      dispatch(setUserInfo(data));
    } catch (err) {
      // non-fatal — we still navigate on login success
      console.error("Fetch user failed:", err?.response?.data || err?.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Email and password are required");
    }
    if (!form.role) {
      return toast.error("Please select a role");
    }
    if (!["Admin", "Doctor", "Patient"].includes(form.role)) {
      return toast.error("Please select a valid role");
    }
    if (form.password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    }

    setSubmitting(true);
    try {
      const { data } = await toast.promise(
        axios.post("/user/login", {
          email: form.email,
          password: form.password,
          role: form.role,
        }),
        {
          loading: "Logging in...",
          success: "Login successful 🎉",
          error: "Unable to login user",
        }
      );

      // Expected server shape: { msg: string, token: string }
      const token = data?.token;
      if (!token) {
        throw new Error("No token returned from server");
      }

      // Persist auth
      localStorage.setItem("token", token);
      localStorage.setItem("role", form.role);

      // Fire user fetch (non-blocking)
      fetchAndStoreUser(token);

      // Redirect immediately based on role
      if (form.role === "Admin") {
        navigate("/dashboard/home", { replace: true });
      } else {
        navigate("/", { replace: true }); // or "/profile" if you prefer
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      toast.error(msg);
      console.error("Login error:", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Sign In</h2>

          <form onSubmit={onSubmit} className="register-form">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
            />
            <select
              name="role"
              className="form-input"
              value={form.role}
              onChange={onChange}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Patient">Patient</option>
            </select>

            <button type="submit" className="btn form-btn" disabled={submitting}>
              {submitting ? "Logging in..." : "Sign in"}
            </button>
          </form>

          <NavLink className="login-link" to={"/forgotpassword"}>
            Forgot Password
          </NavLink>

          <p>
            Not a user?{" "}
            <NavLink className="login-link" to={"/register"}>
              Register
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
};

export default Login;
