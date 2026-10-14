
import { useEffect, useState } from "react";
import "./App.css";

import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Skills from "./Skills";

const API_URL = "http://localhost:8080";

const getPercentage = (value) => {
  const percentage = Number(value);
  return Number.isFinite(percentage) ? percentage : 0;
};

const getSkillNames = (job, field) => {
  const skills = job?.[field];

  if (Array.isArray(skills)) {
    return skills;
  }

  if (typeof skills === "string" && skills.trim()) {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

function Brand() {
  return (
    <span className="brand">
      <span className="brand-icon">C</span>
      <span>
        <strong>CareerMatch</strong>
        <small>AI-powered career discovery</small>
      </span>
    </span>
  );
}

function MatchIndicator({ label, matched }) {
  const isMatched = matched === true || matched === "true";

  return (
    <div className="match-indicator">
      <span className="match-indicator-label">{label}</span>
      <span className={isMatched ? "status-matched" : "status-unmatched"}>
        {isMatched ? "✓ Matched" : "— Not matched"}
      </span>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSkills, setShowSkills] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Search, filter, and sorting states.
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [minMatch, setMinMatch] = useState("0");
  const [sortBy, setSortBy] = useState("highest");

  // Fetch recommendations from the existing backend API.
  useEffect(() => {
    const shouldFetch =
      isLoggedIn &&
      !showRegister &&
      !showLogin &&
      !showProfile &&
      !showSkills;

    if (!shouldFetch) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setJobs([]);
      setError("Please log in to view job recommendations.");
      return;
    }

    const controller = new AbortController();

    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/recommendations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (
            response.status === 401 ||
            response.status === 403
          ) {
            throw new Error(
              "Your session may have expired. Please log in again."
            );
          }

          throw new Error(
            `Unable to load recommendations. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "The recommendations response is not in the expected format."
          );
        }

        setJobs(data);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }

        setError(
          fetchError.message ||
            "Unable to load recommendations. Please try again."
        );
        setJobs([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => controller.abort();
  }, [
    isLoggedIn,
    showRegister,
    showLogin,
    showProfile,
    showSkills,
    refreshKey,
  ]);

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    setShowProfile(false);
    setShowSkills(false);
    setError("");
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowProfile(false);
    setShowSkills(false);
    setError("");
  };

  const handleShowDashboard = () => {
    setShowRegister(false);
    setShowLogin(false);
    setShowProfile(false);
    setShowSkills(false);
    setSelectedJob(null);
    setError("");
  };

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setShowRegister(false);
    setError("");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setIsLoggedIn(false);
      setShowLogin(true);
      setError("Login information is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/profiles/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        setShowProfile(true);
        setShowSkills(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to check your profile. Please try again."
        );
      }

      setShowProfile(false);
      setShowSkills(true);
    } catch (profileError) {
      setError(
        profileError.message ||
          "Unable to load your profile information."
      );
      setShowProfile(false);
      setShowSkills(false);
    }
  };

  const handleProfileSaved = () => {
    setShowProfile(false);
    setShowSkills(true);
    setError("");
  };

  const handleSkillsSaved = () => {
    setShowSkills(false);
    setShowProfile(false);
    setShowRegister(false);
    setShowLogin(false);
    setError("");
    setRefreshKey((key) => key + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setShowRegister(false);
    setShowLogin(false);
    setShowProfile(false);
    setShowSkills(false);

    setJobs([]);
    setSelectedJob(null);
    setLoading(false);
    setError("");

    setSearchTerm("");
    setSelectedLocation("all");
    setMinMatch("0");
    setSortBy("highest");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setMinMatch("0");
    setSortBy("highest");
  };

  // Build the location options from the available recommendations.
  const locations = [
    ...new Set(
      jobs
        .map((job) => (job.location || "").trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  // Apply the search and filter options.
  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.trim().toLowerCase();

    const title = (job.jobTitle || "").toLowerCase();
    const company = (job.company || "").toLowerCase();

    const matchesSearch =
      title.includes(search) || company.includes(search);

    const matchesLocation =
      selectedLocation === "all" ||
      (job.location || "").trim() === selectedLocation;

    const matchesPercentage =
      getPercentage(job.matchPercentage) >= Number(minMatch);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesPercentage
    );
  });

  // Sort the filtered results without changing the original jobs array.
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "highest") {
      return (
        getPercentage(b.matchPercentage) -
        getPercentage(a.matchPercentage)
      );
    }

    if (sortBy === "lowest") {
      return (
        getPercentage(a.matchPercentage) -
        getPercentage(b.matchPercentage)
      );
    }

    if (sortBy === "title") {
      return (a.jobTitle || "").localeCompare(
        b.jobTitle || "",
        undefined,
        { sensitivity: "base" }
      );
    }

    return 0;
  });

  // Dashboard statistics use the filtered results.
  const totalJobs = filteredJobs.length;

  const topMatch =
    totalJobs > 0
      ? Math.max(
          ...filteredJobs.map((job) =>
            getPercentage(job.matchPercentage)
          )
        )
      : 0;

  const strongMatches = filteredJobs.filter(
    (job) => getPercentage(job.matchPercentage) >= 75
  ).length;

  const userName = localStorage.getItem("name") || "Job Seeker";

  // Shared header using the existing stylesheet classes.
  const renderHeader = (actions) => (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand"
          onClick={handleShowDashboard}
          aria-label="CareerMatch home"
        >
          <Brand />
        </button>

        <nav className="header-actions">{actions}</nav>
      </div>
    </header>
  );

  // Registration page.
  if (showRegister) {
    return (
      <div className="app-shell">
        {renderHeader(
          <button
            type="button"
            className="button button-secondary"
            onClick={handleShowLogin}
          >
            Already have an account? Log in
          </button>
        )}

        <main className="form-page">
          <button
            type="button"
            className="back-button"
            onClick={handleShowDashboard}
          >
            ← Back to home
          </button>

          <Register />
        </main>
      </div>
    );
  }

  // Login page.
  if (showLogin) {
    return (
      <div className="app-shell">
        {renderHeader(
          <button
            type="button"
            className="button button-secondary"
            onClick={handleShowRegister}
          >
            Create an account
          </button>
        )}

        <main className="form-page">
          <button
            type="button"
            className="back-button"
            onClick={handleShowDashboard}
          >
            ← Back to home
          </button>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <Login onLoginSuccess={handleLoginSuccess} />
        </main>
      </div>
    );
  }

  // Profile page.
  if (showProfile) {
    return (
      <div className="app-shell">
        {renderHeader(
          <button
            type="button"
            className="button button-secondary"
            onClick={handleLogout}
          >
            Log out
          </button>
        )}

        <main className="form-page">
          <button
            type="button"
            className="back-button"
            onClick={handleShowDashboard}
          >
            ← Back to dashboard
          </button>

          <Profile onProfileSaved={handleProfileSaved} />
        </main>
      </div>
    );
  }

  // Skills page.
  if (showSkills) {
    return (
      <div className="app-shell">
        {renderHeader(
          <button
            type="button"
            className="button button-secondary"
            onClick={handleLogout}
          >
            Log out
          </button>
        )}

        <main className="form-page">
          <button
            type="button"
            className="back-button"
            onClick={handleShowDashboard}
          >
            ← Back to dashboard
          </button>

          <Skills onSkillsSaved={handleSkillsSaved} />
        </main>
      </div>
    );
  }

  // Landing page for users who are not logged in.
  if (!isLoggedIn) {
    return (
      <div className="app-shell">
        {renderHeader(
          <>
            <button
              type="button"
              className="button button-secondary"
              onClick={handleShowLogin}
            >
              Log in
            </button>

            <button
              type="button"
              className="button button-primary"
              onClick={handleShowRegister}
            >
              Get started
            </button>
          </>
        )}

        <main className="dashboard">
          <section className="hero-section">
            <div className="hero-content">
              <span className="eyebrow">
                AI-POWERED CAREER DISCOVERY
              </span>

              <h1>
                Find opportunities that
                <span> match your skills.</span>
              </h1>

              <p>
                Discover job opportunities based on your skills,
                experience, education, and preferred location.
              </p>

              <button
                type="button"
                className="button button-primary hero-button"
                onClick={handleShowRegister}
              >
                Find my job matches →
              </button>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />

              <div className="hero-briefcase">💼</div>

              <div className="floating-card floating-card-top">
                <span className="floating-card-icon">✓</span>
                <span>
                  <strong>Skills matched</strong>
                  <small>Personalized discovery</small>
                </span>
              </div>

              <div className="floating-card floating-card-bottom">
                <span className="floating-score">95%</span>
                <span>
                  <strong>Great match</strong>
                  <small>Your next opportunity</small>
                </span>
              </div>
            </div>
          </section>

          <section className="guest-panel">
            <div className="guest-icon">✦</div>
            <h2>Your next opportunity starts here</h2>
            <p>
              Create an account to explore personalized job
              recommendations and understand how your skills align
              with potential roles.
            </p>

            <div className="guest-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={handleShowRegister}
              >
                Create an account
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={handleShowLogin}
              >
                I already have an account
              </button>
            </div>
          </section>

          <footer className="site-footer">
            <span>CareerMatch</span>
            <span>Discover opportunities that fit your skills.</span>
          </footer>
        </main>
      </div>
    );
  }

  // Main recommendations dashboard.
  return (
    <div className="app-shell">
      {renderHeader(
        <>
          <span className="welcome-user">
            Hello, {userName}
          </span>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setShowProfile(true);
              setShowSkills(false);
            }}
          >
            My profile
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setShowSkills(true);
              setShowProfile(false);
            }}
          >
            My skills
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={handleLogout}
          >
            Log out
          </button>
        </>
      )}

      <main className="dashboard">
        <section className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR PERSONALIZED JOB DASHBOARD
            </span>

            <h1>
              Your next career move
              <span> starts here.</span>
            </h1>

            <p>
              Explore job opportunities selected for your skills,
              experience, education, and career preferences.
            </p>

            <button
              type="button"
              className="button button-primary hero-button"
              onClick={() =>
                document
                  .getElementById("recommendations")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore recommendations ↓
            </button>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-briefcase">💼</div>

            <div className="floating-card floating-card-top">
              <span className="floating-card-icon">✓</span>
              <span>
                <strong>Personalized matches</strong>
                <small>Based on your profile</small>
              </span>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="floating-score">
                {topMatch}%
              </span>
              <span>
                <strong>Top match</strong>
                <small>Your current results</small>
              </span>
            </div>
          </div>
        </section>

        {error && !loading && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>

            <button
              type="button"
              className="alert-action"
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-blue">▤</div>
            <div>
              <p>Matching jobs</p>
              <strong>{totalJobs}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-green">✓</div>
            <div>
              <p>Highest match</p>
              <strong>{topMatch}%</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-purple">✦</div>
            <div>
              <p>Strong matches</p>
              <strong>{strongMatches}</strong>
            </div>
          </div>
        </section>

        <section
          className="recommendations-section"
          id="recommendations"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                CAREER OPPORTUNITIES
              </span>

              <h2>Recommended jobs</h2>

              <p>
                Discover your matches and explore the details of
                each opportunity.
              </p>
            </div>

            <span className="job-count">
              {filteredJobs.length} of {jobs.length} jobs
            </span>
          </div>

          {/* Search, filters, and sorting */}
          <section className="job-filters">
            <div className="filter-field search-field">
              <label htmlFor="job-search">Search jobs</label>

              <input
                id="job-search"
                type="search"
                placeholder="Job title or company"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <div className="filter-field">
              <label htmlFor="location-filter">Location</label>

              <select
                id="location-filter"
                value={selectedLocation}
                onChange={(event) =>
                  setSelectedLocation(event.target.value)
                }
              >
                <option value="all">All locations</option>

                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="minimum-match">Minimum match</label>

              <select
                id="minimum-match"
                value={minMatch}
                onChange={(event) =>
                  setMinMatch(event.target.value)
                }
              >
                <option value="0">Any match</option>
                <option value="50">50% or higher</option>
                <option value="60">60% or higher</option>
                <option value="70">70% or higher</option>
                <option value="80">80% or higher</option>
                <option value="90">90% or higher</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="sort-jobs">Sort by</label>

              <select
                id="sort-jobs"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
              >
                <option value="highest">Highest match first</option>
                <option value="lowest">Lowest match first</option>
                <option value="title">Job title A–Z</option>
              </select>
            </div>

            <button
              type="button"
              className="button button-secondary clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          </section>

          <p className="filter-results-count">
            Showing {filteredJobs.length} matching jobs
          </p>

          {loading && (
            <div className="state-card">
              <div className="loading-spinner" />
              <h3>Finding your job matches</h3>
              <p>Please wait while we load your recommendations.</p>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="state-card">
              <div className="state-icon">⌕</div>
              <h3>No recommendations available yet</h3>
              <p>
                Save your profile and skills, then refresh your
                recommendations.
              </p>

              <button
                type="button"
                className="button button-primary"
                onClick={() => setRefreshKey((key) => key + 1)}
              >
                Refresh recommendations
              </button>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && filteredJobs.length === 0 && (
            <div className="state-card">
              <div className="state-icon">⌕</div>
              <h3>No matching jobs found</h3>
              <p>
                Try another search term or change your filters.
              </p>

              <button
                type="button"
                className="button button-primary"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            </div>
          )}

          {!loading && !error && sortedJobs.length > 0 && (
            <div className="jobs-grid">
              {sortedJobs.map((job, index) => {
                const percentage = getPercentage(
                  job.matchPercentage
                );

                const matchingSkills = getSkillNames(
                  job,
                  "matchingSkillNames"
                );

                const missingSkills = getSkillNames(
                  job,
                  "missingSkillNames"
                );

                return (
                  <article
                    className="job-card"
                    key={
                      job.jobId ??
                      `${job.jobTitle}-${job.company}-${index}`
                    }
                  >
                    <div className="job-card-top">
                      <div className="company-avatar">
                        {(job.company || "J")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="job-title-block">
                        <h3>
                          {job.jobTitle || "Job title not available"}
                        </h3>

                        <p className="company-name">
                          {job.company || "Company not specified"}
                        </p>
                      </div>

                      <div className="overall-match">
                        <strong>{percentage}%</strong>
                        <span>Match</span>
                      </div>
                    </div>

                    <div className="job-meta">
                      <span>
                        <span aria-hidden="true">⌖</span>
                        {job.location || "Location not specified"}
                      </span>

                      <span>
                        <span aria-hidden="true">✦</span>
                        {percentage >= 80
                          ? "Excellent match"
                          : percentage >= 60
                          ? "Good potential"
                          : "Explore role"}
                      </span>
                    </div>

                    <div className="card-divider" />

                    <div className="skill-match-heading">
                      <div>
                        <strong>Skill compatibility</strong>
                        <span>
                          {job.matchingSkills ?? matchingSkills.length}
                          {job.totalRequiredSkills != null
                            ? ` of ${job.totalRequiredSkills} required skills`
                            : " matching skills"}
                        </span>
                      </div>

                      <strong className="skill-match-score">
                        {getPercentage(job.skillMatchPercentage)}%
                      </strong>
                    </div>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-label="Skill match percentage"
                      aria-valuenow={Math.max(
                        0,
                        Math.min(
                          100,
                          getPercentage(job.skillMatchPercentage)
                        )
                      )}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              getPercentage(job.skillMatchPercentage)
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    {matchingSkills.length > 0 && (
                      <div className="skill-list-block">
                        <span className="skill-list-label">
                          MATCHING SKILLS
                        </span>

                        <div className="skill-tags">
                          {matchingSkills.slice(0, 5).map(
                            (skill, skillIndex) => (
                              <span
                                className="skill-tag skill-tag-match"
                                key={`${skill}-${skillIndex}`}
                              >
                                {skill}
                              </span>
                            )
                          )}

                          {matchingSkills.length > 5 && (
                            <span className="skill-tag">
                              +{matchingSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="match-details">
                      <MatchIndicator
                        label="Experience"
                        matched={job.experienceMatch}
                      />

                      <MatchIndicator
                        label="Location"
                        matched={job.locationMatch}
                      />

                      <MatchIndicator
                        label="Education"
                        matched={job.educationMatch}
                      />
                    </div>

                    <button
                      type="button"
                      className="button button-primary view-job-button"
                      onClick={() => setSelectedJob(job)}
                    >
                      View job details <span>→</span>
                    </button>

                    {missingSkills.length > 0 && (
                      <p className="modal-muted">
                        Skills to improve: {missingSkills.join(", ")}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="site-footer">
          <span>CareerMatch</span>
          <span>Personalized job discovery, powered by your skills.</span>
        </footer>
      </main>

      {/* Job details modal */}
      {selectedJob && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedJob(null);
            }
          }}
        >
          <section
            className="job-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-modal-title"
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close job details"
              onClick={() => setSelectedJob(null)}
            >
              ×
            </button>

            <div className="modal-company-avatar">
              {(selectedJob.company || "J")
                .charAt(0)
                .toUpperCase()}
            </div>

            <span className="eyebrow">YOUR MATCH DETAILS</span>

            <h2 id="job-modal-title">
              {selectedJob.jobTitle || "Job details"}
            </h2>

            <p className="modal-company">
              {selectedJob.company || "Company not specified"}
            </p>

            <p className="modal-location">
              {selectedJob.location || "Location not specified"}
            </p>

            <div className="modal-score-grid">
              <div>
                <span>Overall match</span>
                <strong>
                  {getPercentage(selectedJob.matchPercentage)}%
                </strong>
              </div>

              <div>
                <span>Skill match</span>
                <strong>
                  {getPercentage(selectedJob.skillMatchPercentage)}%
                </strong>
              </div>
            </div>

            <div className="modal-section">
              <h3>Compatibility details</h3>

              <MatchIndicator
                label="Experience match"
                matched={selectedJob.experienceMatch}
              />

              <MatchIndicator
                label="Location match"
                matched={selectedJob.locationMatch}
              />

              <MatchIndicator
                label="Education match"
                matched={selectedJob.educationMatch}
              />
            </div>

            <div className="modal-section">
              <h3>Matching skills</h3>

              {getSkillNames(
                selectedJob,
                "matchingSkillNames"
              ).length > 0 ? (
                <div className="skill-tags">
                  {getSkillNames(
                    selectedJob,
                    "matchingSkillNames"
                  ).map((skill, index) => (
                    <span
                      className="skill-tag skill-tag-match"
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="modal-muted">
                  No matching skill details are available.
                </p>
              )}
            </div>

            <div className="modal-section">
              <h3>Skills to improve</h3>

              {getSkillNames(
                selectedJob,
                "missingSkillNames"
              ).length > 0 ? (
                <div className="skill-tags">
                  {getSkillNames(
                    selectedJob,
                    "missingSkillNames"
                  ).map((skill, index) => (
                    <span
                      className="skill-tag skill-tag-missing"
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="modal-muted">
                  No missing skill details are available.
                </p>
              )}
            </div>

            <button
              type="button"
              className="button button-primary modal-done-button"
              onClick={() => setSelectedJob(null)}
            >
              Close details
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
