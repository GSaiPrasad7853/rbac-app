import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("STUDENT"); // ✅ NEW
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      const user = res.data.user;
      const token = res.data.token;

      // ✅ Role mismatch check
      if (loginType === "ADMIN" && user.role !== "ADMIN") {
        setError("You are not authorized to login as Admin");
        return;
      }

      if (loginType === "STUDENT" && user.role !== "STUDENT") {
        setError("Please select Admin login for this account");
        return;
      }

      login(user, token);

      // ✅ Route based on role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* ✅ Login Type Selector */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <label>
            <input
              type="radio"
              name="loginType"
              value="STUDENT"
              checked={loginType === "STUDENT"}
              onChange={() => setLoginType("STUDENT")}
            />{" "}
            Student
          </label>

          <label>
            <input
              type="radio"
              name="loginType"
              value="ADMIN"
              checked={loginType === "ADMIN"}
              onChange={() => setLoginType("ADMIN")}
            />{" "}
            Admin
          </label>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login as {loginType === "ADMIN" ? "Admin" : "Student"}
        </button>
      </form>

      <p>
        New here? <Link to="/register">Register as Student</Link>
      </p>
    </div>
  );
}
