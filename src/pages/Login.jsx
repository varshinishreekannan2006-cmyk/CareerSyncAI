import { useState } from "react";
import axios from "axios";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const handleRegister = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name,
        email,
        password,
      }
    );

    alert(response.data.message);

    setIsRegister(false);

    setName("");
    setEmail("");
    setPassword("");

  } catch (error) {
    alert(
      error.response?.data?.message || "Registration Failed"
    );
  }
};

  const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    // Save JWT token
    localStorage.setItem("token", response.data.token);

    alert(response.data.message);

    window.location.reload();

  } catch (error) {
    alert(
      error.response?.data?.message || "Login Failed"
    );
  }
};

  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginTop: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "18px",
    boxSizing: "border-box"
  };

  const mainButton = {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold"
  };

  const secondaryButton = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px"
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f9"
      }}
    >
      <div
        style={{
          width: "450px",
          padding: "40px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)"
        }}
      >
        <h1
  style={{
    textAlign: "center",
    fontSize: "42px",
    marginBottom: "10px",
    color: "#2563eb",
    fontWeight: "bold"
  }}
>
  CareerSync AI
</h1>

<h2
  style={{
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  }}
>
  {isRegister ? "Create Account" : "Login"}
</h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          style={mainButton}
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          style={secondaryButton}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New User? Register"}
        </button>
      </div>
    </div>
  );
  
}

export default Login;