import { useEffect, useState } from "react";
import "./App.css";
import Register from "./Register";
import Login from "./Login";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setJobs([]);
    setSelectedJob(null);
    setError("");
    setIsLoggedIn(false);
    setShowLogin(false);
    setLoading(false);
  };

  // Fetch recommendations
  useEffect(() => {
    if (showRegister || showLogin) {
      return;
    }

    const token = localStorage.getItem("token");

    console.log(
      "Token exists:",
      token ? "YES" : "NO"
    );

    if (!token) {
      setJobs([]);
      setError("");
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);
    setLoading(true);

    fetch("http://localhost:8080/api/recommendations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("Recommendations:", data);

        setJobs(data);
        setError("");
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Recommendation error:",
          error
        );

        setError(error.message);
        setLoading(false);
      });
  }, [showRegister, showLogin]);

  // Show Registration page
  if (showRegister) {
    return (
      <div>
        <button
          className="back-button"
          onClick={() => {
            setShowRegister(false);
            setLoading(false);
          }}
        >
          ← Back to Recommendations
        </button>

        <Register />
      </div>
    );
  }

  // Show Login page
  if (showLogin) {
    return (
      <div>
        <button
          className="back-button"
          onClick={() => setShowLogin(false)}
        >
          ← Back to Recommendations
        </button>

        <Login
          onLoginSuccess={() => {
            setShowLogin(false);
            setShowRegister(false);
            setIsLoggedIn(true);
            setLoading(true);
            setError("");
          }}
        />
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          Loading job recommendations...
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {/* Header */}
      <header className="header">

        <div className="top-bar">

          <h1>AI Job Recommendations</h1>

          <div>

            {isLoggedIn ? (
              <button
                className="login-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className="login-button"
                  onClick={() => {
                    setShowLogin(true);
                    setShowRegister(false);
                    setError("");
                  }}
                >
                  Login
                </button>

                <button
                  className="register-button"
                  onClick={() => {
                    setShowRegister(true);
                    setShowLogin(false);
                    setError("");
                  }}
                >
                  Register
                </button>
              </>
            )}

          </div>

        </div>

        <p>
          Jobs recommended based on your skills, experience,
          location and education.
        </p>

      </header>

      {/* Error message */}
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {/* No login message */}
      {!isLoggedIn && (
        <div className="login-message">
          <p>
            Please login to view your personalized job
            recommendations.
          </p>
        </div>
      )}

      {/* Job Cards */}
      <main className="jobs-container">

        {jobs.map((job) => (

          <div
            className="job-card"
            key={job.jobId}
          >

            <div className="job-header">

              <div>

                <h2>
                  {job.jobTitle}
                </h2>

                <p className="company">
                  {job.company}
                </p>

                <p className="location">
                  📍 {job.location}
                </p>

              </div>

              <div className="match-badge">

                {job.matchPercentage}%

                <span>
                  Match
                </span>

              </div>

            </div>

            <div className="divider"></div>

            {/* Skill Match */}
            <div className="skill-section">

              <div className="skill-header">

                <strong>
                  Skill Match
                </strong>

                <span>
                  {job.skillMatchPercentage}%
                </span>

              </div>

              <div className="progress-bar">

                <div
                  className="progress"
                  style={{
                    width: `${job.skillMatchPercentage}%`,
                  }}
                ></div>

              </div>

              <p>
                {job.matchingSkills} of{" "}
                {job.totalRequiredSkills} required skills matched
              </p>

            </div>

            {/* Matching Details */}
            <div className="details">

              <div>
                <span>
                  Experience
                </span>

                <strong>
                  {job.experienceMatch
                    ? "✓ Matched"
                    : "✗ Not Matched"}
                </strong>
              </div>

              <div>
                <span>
                  Location
                </span>

                <strong>
                  {job.locationMatch
                    ? "✓ Matched"
                    : "✗ Not Matched"}
                </strong>
              </div>

              <div>
                <span>
                  Education
                </span>

                <strong>
                  {job.educationMatch
                    ? "✓ Matched"
                    : "✗ Not Matched"}
                </strong>
              </div>

            </div>

            {/* View Job */}
            <button
              className="view-button"
              onClick={() => setSelectedJob(job)}
            >
              View Job
            </button>

          </div>

        ))}

      </main>

      {/* Job Details Modal */}
      {selectedJob && (

        <div className="job-details">

          <div className="job-details-card">

            <button
              className="close-button"
              onClick={() => setSelectedJob(null)}
            >
              ✕
            </button>

            <h2>
              {selectedJob.jobTitle}
            </h2>

            <p>
              <strong>
                Company:
              </strong>{" "}
              {selectedJob.company}
            </p>

            <p>
              <strong>
                Location:
              </strong>{" "}
              {selectedJob.location}
            </p>

            <p>
              <strong>
                Overall Match:
              </strong>{" "}
              {selectedJob.matchPercentage}%
            </p>

            <p>
              <strong>
                Skill Match:
              </strong>{" "}
              {selectedJob.skillMatchPercentage}%
            </p>

            <p>
              <strong>
                Experience:
              </strong>{" "}
              {selectedJob.experienceMatch
                ? "Matched"
                : "Not Matched"}
            </p>

            <p>
              <strong>
                Location:
              </strong>{" "}
              {selectedJob.locationMatch
                ? "Matched"
                : "Not Matched"}
            </p>

            <p>
              <strong>
                Education:
              </strong>{" "}
              {selectedJob.educationMatch
                ? "Matched"
                : "Not Matched"}
            </p>

            <button
              className="close-details-button"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;