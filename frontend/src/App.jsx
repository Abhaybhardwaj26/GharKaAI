import { useState } from "react";
import "./App.css";
import ProblemSolver from "./ProblemSolver";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const isHindi = language === "hi";

  // =====================================================
  // NAVIGATION
  // =====================================================

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const goHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // AUTH
  // =====================================================

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const closeAuth = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app light-mode"
      }
    >

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        <button
          className="logo"
          onClick={goHome}
          aria-label="Go to home"
        >
          <span className="logo-icon">
            🏠
          </span>

          <span>
            GharKaAI
          </span>
        </button>


        <nav className="nav-links">

          <button
            className="nav-button"
            onClick={() =>
              scrollToSection("how-it-works")
            }
          >
            {isHindi
              ? "कैसे काम करता है"
              : "How it works"}
          </button>


          <button
            className="nav-button"
            onClick={() =>
              scrollToSection("features")
            }
          >
            {isHindi
              ? "फीचर्स"
              : "Features"}
          </button>


          {/* LANGUAGE */}

          <div className="language-switcher">

            <button
              type="button"
              className={
                language === "en"
                  ? "language-button active"
                  : "language-button"
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              EN
            </button>

            <button
              type="button"
              className={
                language === "hi"
                  ? "language-button active"
                  : "language-button"
              }
              onClick={() =>
                setLanguage("hi")
              }
            >
              हिन्दी
            </button>

          </div>


          {/* DARK MODE */}

          <button
            type="button"
            className="theme-button"
            onClick={() =>
              setDarkMode((prev) => !prev)
            }
            aria-label="Toggle theme"
            title={
              darkMode
                ? "Light mode"
                : "Dark mode"
            }
          >
            {darkMode
              ? "☀️"
              : "🌙"}
          </button>


          {/* LOGIN */}

          <button
            type="button"
            className="login-button"
            onClick={openLogin}
          >
            {isHindi
              ? "लॉगिन"
              : "Login"}
          </button>

        </nav>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main>

        {/* =================================================
            PROBLEM SOLVER
        ================================================= */}

        <ProblemSolver
          language={language}
          darkMode={darkMode}
        />


        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section
          id="how-it-works"
          className="how-it-works-section"
        >

          <div className="section-heading">

            <span className="section-label">
              {isHindi
                ? "कैसे काम करता है"
                : "HOW IT WORKS"}
            </span>

            <h2>
              {isHindi
                ? "समस्या से समाधान तक।"
                : "From problem to solution."}
            </h2>

            <p>
              {isHindi
                ? "GharKaAI आपकी घरेलू समस्या को समझकर आपको सही दिशा में आगे बढ़ने में मदद करता है।"
                : "GharKaAI turns your household problem into clear, practical next steps."}
            </p>

          </div>


          <div className="steps-container">

            {/* =================================================
                STEP 01
            ================================================= */}

            <article className="step-card">

              <div className="step-top">

                <span className="step-number">
                  01
                </span>

                <span className="step-icon">
                  💬
                </span>

              </div>

              <h3>
                {isHindi
                  ? "समस्या बताएं"
                  : "Tell us what's wrong"}
              </h3>

              <p>
                {isHindi
                  ? "अपनी समस्या लिखें, बोलकर बताएं या उसकी फोटो अपलोड करें।"
                  : "Describe the problem, use your voice, or upload a photo of the issue."}
              </p>

              <div className="step-tag">
                {isHindi
                  ? "Text • Voice • Photo"
                  : "Text • Voice • Photo"}
              </div>

            </article>


            {/* CONNECTOR */}

            <div className="step-connector">
              <span>→</span>
            </div>


            {/* =================================================
                STEP 02
            ================================================= */}

            <article className="step-card">

              <div className="step-top">

                <span className="step-number">
                  02
                </span>

                <span className="step-icon">
                  🤖
                </span>

              </div>

              <h3>
                {isHindi
                  ? "AI विश्लेषण करता है"
                  : "AI analyzes it"}
              </h3>

              <p>
                {isHindi
                  ? "AI आपकी जानकारी और फोटो को देखकर संभावित समस्या और कारणों को समझता है।"
                  : "AI analyzes your information and image to identify the possible problem and its causes."}
              </p>

              <div className="step-tag">
                {isHindi
                  ? "Smart AI Analysis"
                  : "Smart AI Analysis"}
              </div>

            </article>


            {/* CONNECTOR */}

            <div className="step-connector">
              <span>→</span>
            </div>


            {/* =================================================
                STEP 03
            ================================================= */}

            <article className="step-card">

              <div className="step-top">

                <span className="step-number">
                  03
                </span>

                <span className="step-icon">
                  ✨
                </span>

              </div>

              <h3>
                {isHindi
                  ? "समाधान पाएं"
                  : "Get your solution"}
              </h3>

              <p>
                {isHindi
                  ? "सुरक्षित कदम, संभावित कारण, लागत अनुमान और अगले चरण पाएं।"
                  : "Get practical steps, possible causes, safety guidance and an estimated repair cost."}
              </p>

              <div className="step-tag">
                {isHindi
                  ? "Clear & Practical"
                  : "Clear & Practical"}
              </div>

            </article>

          </div>


          {/* BOTTOM TRUST LINE */}

          <div className="how-it-works-bottom">

            <span>
              ✓
            </span>

            <p>
              {isHindi
                ? "सरल • तेज़ • AI आधारित"
                : "Simple • Fast • AI-powered"}
            </p>

          </div>

        </section>


        {/* =================================================
            FEATURES
        ================================================= */}

        <section
          id="features"
          className="features-section"
        >

          <div className="section-heading">

            <span className="section-label">
              {isHindi
                ? "फीचर्स"
                : "FEATURES"}
            </span>

            <h2>
              {isHindi
                ? "आपकी समस्या, एक स्मार्ट समाधान।"
                : "Everything you need in one place."}
            </h2>

            <p>
              {isHindi
                ? "GharKaAI आपकी रोज़मर्रा की घरेलू समस्याओं को समझने और हल करने के लिए स्मार्ट टूल्स देता है।"
                : "Smart tools designed to help you understand and solve everyday household problems."}
            </p>

          </div>


          <div className="features-container">

            {/* FEATURE 01 */}

            <article className="feature-card">

              <div className="feature-icon">
                🤖
              </div>

              <span className="feature-number">
                01
              </span>

              <h3>
                {isHindi
                  ? "AI समस्या विश्लेषण"
                  : "AI Problem Analysis"}
              </h3>

              <p>
                {isHindi
                  ? "अपनी समस्या बताएं और AI संभावित समस्या और उसके कारणों को समझने में आपकी मदद करेगा।"
                  : "Describe your problem and let AI identify the possible issue and its likely causes."}
              </p>

            </article>


            {/* FEATURE 02 */}

            <article className="feature-card">

              <div className="feature-icon">
                📸
              </div>

              <span className="feature-number">
                02
              </span>

              <h3>
                {isHindi
                  ? "फोटो विश्लेषण"
                  : "Photo Analysis"}
              </h3>

              <p>
                {isHindi
                  ? "समस्या की फोटो अपलोड करें ताकि AI स्थिति को देखकर बेहतर विश्लेषण कर सके।"
                  : "Upload a photo so AI can use visual information to better understand the problem."}
              </p>

            </article>


            {/* FEATURE 03 */}

            <article className="feature-card">

              <div className="feature-icon">
                🎤
              </div>

              <span className="feature-number">
                03
              </span>

              <h3>
                {isHindi
                  ? "वॉइस इनपुट"
                  : "Voice Input"}
              </h3>

              <p>
                {isHindi
                  ? "टाइप करने की जरूरत नहीं। अपनी समस्या बोलकर भी GharKaAI को बता सकते हैं।"
                  : "Don't want to type? Simply speak your problem and let GharKaAI understand it."}
              </p>

            </article>


            {/* FEATURE 04 */}

            <article className="feature-card">

              <div className="feature-icon">
                🌐
              </div>

              <span className="feature-number">
                04
              </span>

              <h3>
                {isHindi
                  ? "हिंदी और अंग्रेज़ी"
                  : "Hindi & English"}
              </h3>

              <p>
                {isHindi
                  ? "अपनी पसंद की भाषा चुनें और AI का जवाब हिंदी या अंग्रेज़ी में पाएं।"
                  : "Choose the language you prefer and get AI responses in Hindi or English."}
              </p>

            </article>


            {/* FEATURE 05 */}

            <article className="feature-card">

              <div className="feature-icon">
                💰
              </div>

              <span className="feature-number">
                05
              </span>

              <h3>
                {isHindi
                  ? "रिपेयर लागत अनुमान"
                  : "Repair Cost Estimate"}
              </h3>

              <p>
                {isHindi
                  ? "समस्या के आधार पर संभावित रिपेयर लागत की अनुमानित रेंज पाएं।"
                  : "Get an approximate repair cost range based on the identified problem."}
              </p>

            </article>


            {/* FEATURE 06 */}

            <article className="feature-card">

              <div className="feature-icon">
                ⚠️
              </div>

              <span className="feature-number">
                06
              </span>

              <h3>
                {isHindi
                  ? "सुरक्षा मार्गदर्शन"
                  : "Safety Guidance"}
              </h3>

              <p>
                {isHindi
                  ? "खतरनाक समस्याओं के लिए महत्वपूर्ण सुरक्षा सावधानियां और विशेषज्ञ की सलाह पाएं।"
                  : "Get important safety guidance and professional recommendations for risky problems."}
              </p>

            </article>

          </div>

        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div className="footer-logo">
          🏠 GharKaAI
        </div>

        <p>
          {isHindi
            ? "रोज़मर्रा की घरेलू समस्याओं को हल करना आसान बनाएं।"
            : "Making everyday household problems easier to solve."}
        </p>

      </footer>


      {/* =================================================
          LOGIN
      ================================================= */}

      {showLogin && (
        <Login
          onClose={closeAuth}
          onSignup={openSignup}
        />
      )}


      {/* =================================================
          SIGNUP
      ================================================= */}

      {showSignup && (
        <Signup
          onClose={closeAuth}
          onLogin={openLogin}
        />
      )}

    </div>
  );
}

export default App;