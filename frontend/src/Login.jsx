import { useState } from "react";
import "./Login.css";

function Login({ onClose, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Empty fields check
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Get saved account
    const savedUser = JSON.parse(
      localStorage.getItem("gharKaAIUser")
    );

    // Check login details
    if (
      savedUser &&
      savedUser.email === email &&
      savedUser.password === password
    ) {
      // Save login status
      localStorage.setItem(
        "gharKaAILoggedIn",
        "true"
      );

      // Close login popup
      onClose();

      // Refresh website
      window.location.reload();
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-overlay">

      <div className="login-box">

        {/* Close Button */}
        <button
          className="close-login"
          onClick={onClose}
        >
          ×
        </button>

        {/* Logo */}
        <div className="login-logo">
          🏠
        </div>

        <h2>Welcome back</h2>

        <p className="login-subtitle">
          Login to continue with GharKaAI
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* Password */}
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {/* Options */}
          <div className="login-options">

            <label className="remember">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="button"
              className="forgot-btn"
              onClick={() =>
                alert(
                  "Password reset feature coming soon!"
                )
              }
            >
              Forgot password?
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>

        {/* Signup */}
        <p className="signup-text">

          Don't have an account?

          <button
            type="button"
            className="signup-btn"
            onClick={onSignup}
          >
            Sign Up
          </button>

        </p>

      </div>

    </div>
  );
}

export default Login;