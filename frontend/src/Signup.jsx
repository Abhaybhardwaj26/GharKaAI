import { useState } from "react";
import "./Signup.css";

function Signup({ onClose, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const user = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      "gharKaAIUser",
      JSON.stringify(user)
    );

    alert("Account created successfully!");

    onClose();

    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="signup-overlay">

      <div className="signup-box">

        <button
          className="close-signup"
          onClick={onClose}
        >
          ×
        </button>

        <div className="signup-logo">
          🏠
        </div>

        <h2>Create your account</h2>

        <p className="signup-subtitle">
          Join GharKaAI and solve everyday problems smarter.
        </p>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button
            type="submit"
            className="signup-submit"
          >
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?

          <button
            type="button"
            onClick={onLogin}
            className="login-link"
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
}

export default Signup;