import React, { useEffect, useState } from "react";
import "./Profile.css";

function Profile({ onProfileSaved }) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    education: "",
    experience: "",
    bio: "",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing profile when the page opens
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `http://localhost:8080/api/profiles/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        // No profile exists yet
        setProfileExists(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load profile");
      }

      const data = await response.json();

      console.log("Existing profile:", data);

      setFormData({
        phone: data.phone || "",
        location: data.location || "",
        education: data.education || "",
        experience: data.experience || "",
        bio: data.bio || "",
      });

      setProfileExists(true);
    } catch (err) {
      console.error("Profile loading error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const method = profileExists ? "PUT" : "POST";

      const response = await fetch(
        `http://localhost:8080/api/profiles/${userId}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (profileExists
              ? "Failed to update profile"
              : "Failed to create profile")
        );
      }

      console.log("Profile saved:", data);

      setProfileExists(true);

      setMessage(
        profileExists
          ? "Profile updated successfully!"
          : "Profile created successfully!"
      );

      if (onProfileSaved) {
        onProfileSaved();
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-icon">👤</div>

            <h1>Loading Profile...</h1>

            <p>
              Please wait while we load your profile information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-icon">👤</div>

          <h1>
            {profileExists
              ? "Update Your Profile"
              : "Complete Your Profile"}
          </h1>

          <p>
            {profileExists
              ? "Update your information to improve your job recommendations."
              : "Tell us about yourself to get personalized job recommendations."}
          </p>
        </div>

        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Phone */}
            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Bengaluru"
                required
              />
            </div>

            {/* Education */}
            <div className="form-group">
              <label>Education</label>

              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Example: B.Tech Computer Science"
                required
              />
            </div>

            {/* Experience */}
            <div className="form-group">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Example: 0-2 years"
                required
              />
            </div>

          </div>

          {/* Bio */}
          <div className="form-group bio-group">
            <label>Professional Bio</label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Briefly describe your skills, experience and career goals..."
              rows="5"
              required
            />

            <span className="character-hint">
              Add a short professional description.
            </span>
          </div>

          <button
            type="submit"
            className="save-profile-button"
            disabled={saving}
          >
            {saving
              ? profileExists
                ? "Updating Profile..."
                : "Saving Profile..."
              : profileExists
                ? "Update & Continue →"
                : "Save & Continue →"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Profile;