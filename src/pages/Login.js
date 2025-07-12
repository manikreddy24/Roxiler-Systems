import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://roxiler-systems-backend.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      login(data.user);

      const role = data.user.role;
      if (data.user.role === "System Administrator") navigate("/admin");
      else if (data.user.role === "Store Owner") navigate("/owner");
      else navigate("/home");

    } else {
      alert("❌ Invalid email or password");
    }
  };

  return (
    <>
     <button className="btn btn-link text-white fs-5" onClick={() => navigate("/home")}>
            🏠 Home
          </button>
    <div className="login-container">
      
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Login
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
  If you are new, please{" "}
  <span
    style={{ fontWeight: "bold", color: "#007bff", cursor: "pointer" }}
    onClick={() => navigate("/register")}
  >
    Register
  </span>
</p>

    </div>
    </>
  );
}
