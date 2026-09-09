import "./Dashboard.css";

function Dashboard({ user, onLogout, onSolveProblem }) {
  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}
      <header className="dashboard-navbar">

        <div className="dashboard-logo">
          🏠 <span>GharKaAI</span>
        </div>

        <button
          className="dashboard-logout"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>


      {/* ================= MAIN ================= */}
      <main className="dashboard-main">

        {/* Welcome Section */}
        <section className="welcome-section">

          <span className="welcome-label">
            YOUR ACCOUNT
          </span>

          <h1 className="dashboard-welcome">
            Welcome, {user?.name || "User"} 👋
          </h1>

          <p className="welcome-subtitle">
            What can we help you solve today?
          </p>

        </section>


        {/* User Card */}
        <section className="user-card">

          <div className="user-icon">
            👤
          </div>

          <div className="user-details">

            <h3>
              {user?.name || "User"}
            </h3>

            <p>
              {user?.email || "No email available"}
            </p>

          </div>

        </section>


        {/* AI Assistant */}
        <section className="assistant-card">

          <div className="assistant-icon">
            ✨
          </div>

          <span className="assistant-label">
            AI HOUSEHOLD ASSISTANT
          </span>

          <h2>
            What problem can we help you with?
          </h2>

          <p>
            Describe your problem or upload a photo and
            let GharKaAI help you understand what is wrong.
          </p>

          <button
            className="solve-button"
            onClick={onSolveProblem}
          >
            Solve a Problem →
          </button>

        </section>


        {/* Quick Features */}
        <section className="dashboard-features">

          <div className="dashboard-feature-card">

            <div className="dashboard-feature-icon">
              🤖
            </div>

            <h3>
              AI Analysis
            </h3>

            <p>
              Understand household problems with AI.
            </p>

          </div>


          <div className="dashboard-feature-card">

            <div className="dashboard-feature-icon">
              📸
            </div>

            <h3>
              Upload Photo
            </h3>

            <p>
              Show the problem with a photo.
            </p>

          </div>


          <div className="dashboard-feature-card">

            <div className="dashboard-feature-icon">
              🛠️
            </div>

            <h3>
              Practical Solutions
            </h3>

            <p>
              Get clear and useful next steps.
            </p>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="dashboard-footer">

        <div>
          🏠 GharKaAI
        </div>

        <p>
          Making everyday problems easier to solve
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;