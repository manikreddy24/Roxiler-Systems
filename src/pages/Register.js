import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("https://roxiler-systems-backend.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "Normal User" }),
    });
    navigate("/login");
  };

  return (
    <div className="container register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="text-center mb-4">Register</h2>
        <input className="form-control mb-3" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="form-control mb-3" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="form-control mb-3" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}
