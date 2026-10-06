import { useState } from "react";

function Login({ onLoginSuccess }) {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Login response:", data);

      if (!response.ok) {
        setError(
          data.message || "Invalid email or password"
        );
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);

      setMessage("Login successful!");

      console.log("Logged-in user ID:", data.userId);
      console.log("Logged-in user:", data.name);

      // Tell App.jsx that login was successful
      if (onLoginSuccess) {
        onLoginSuccess();
      }

    } catch (error) {

      console.error(error);
      setError("Unable to connect to server");

    }
  };

  return (
    <div className="register-container">

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <div className="form-group">

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

        </div>

        <button type="submit">
          Login
        </button>

      </form>

      {message && (
        <p className="success">
          {message}
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

    </div>
  );
}

export default Login;