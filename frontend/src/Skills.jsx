import React, { useEffect, useState } from "react";
import "./Skills.css";

function Skills({ onSkillsSaved }) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [originalSkills, setOriginalSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      // Load all available skills
      const skillsResponse = await fetch(
        "http://localhost:8080/api/skills"
      );

      if (!skillsResponse.ok) {
        throw new Error(
          `Failed to load skills. Status: ${skillsResponse.status}`
        );
      }

      const skillsData = await skillsResponse.json();

      console.log("Available skills:", skillsData);

      setSkills(skillsData);

      // Load skills already selected by this user
      const userSkillsResponse = await fetch(
        `http://localhost:8080/api/user-skills/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!userSkillsResponse.ok) {
        const errorText = await userSkillsResponse.text();

        console.error(
          "User skills API error:",
          errorText
        );

        throw new Error(
          `Failed to load your skills. Status: ${userSkillsResponse.status}`
        );
      }

      const userSkillsData =
        await userSkillsResponse.json();

      console.log(
        "Existing user skills:",
        userSkillsData
      );

      const existingSkillIds =
        userSkillsData.map(
          (userSkill) => userSkill.skillId
        );

      // Current selected skills
      setSelectedSkills(existingSkillIds);

      // Save original skills for comparison later
      setOriginalSkills(existingSkillIds);

    } catch (err) {
      console.error(
        "Skills loading error:",
        err
      );

      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId) => {
    setSelectedSkills((previousSkills) => {

      if (previousSkills.includes(skillId)) {
        // Remove from selected skills
        return previousSkills.filter(
          (id) => id !== skillId
        );
      }

      // Add to selected skills
      return [...previousSkills, skillId];
    });
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0) {
      setError("Please select at least one skill.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // --------------------------------
      // Find newly selected skills
      // --------------------------------

      const skillsToAdd = selectedSkills.filter(
        (skillId) =>
          !originalSkills.includes(skillId)
      );

      // --------------------------------
      // Find removed skills
      // --------------------------------

      const skillsToRemove = originalSkills.filter(
        (skillId) =>
          !selectedSkills.includes(skillId)
      );

      console.log(
        "Skills to add:",
        skillsToAdd
      );

      console.log(
        "Skills to remove:",
        skillsToRemove
      );

      // --------------------------------
      // ADD NEW SKILLS
      // --------------------------------

      for (const skillId of skillsToAdd) {

        const response = await fetch(
          `http://localhost:8080/api/user-skills/${userId}/${skillId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          `Adding skill ${skillId}:`,
          response.status
        );

        if (!response.ok) {
          const data =
            await response.json().catch(
              () => ({})
            );

          throw new Error(
            data.message ||
              `Failed to add skill ${skillId}`
          );
        }
      }

      // --------------------------------
      // REMOVE DESELECTED SKILLS
      // --------------------------------

      for (const skillId of skillsToRemove) {

        const response = await fetch(
          `http://localhost:8080/api/user-skills/${userId}/${skillId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          `Removing skill ${skillId}:`,
          response.status
        );

        if (!response.ok) {
          const data =
            await response.json().catch(
              () => ({})
            );

          throw new Error(
            data.message ||
              `Failed to remove skill ${skillId}`
          );
        }
      }

      // --------------------------------
      // Update original skills
      // --------------------------------

      setOriginalSkills(selectedSkills);

      console.log(
        "Skills updated successfully!"
      );

      // Move to recommendations
      if (onSkillsSaved) {
        onSkillsSaved();
      }

    } catch (err) {
      console.error(
        "Skills saving error:",
        err
      );

      setError(err.message);

    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Loading screen
  // --------------------------------

  if (loading) {
    return (
      <div className="skills-page">
        <div className="skills-card loading-card">

          <div className="skills-spinner"></div>

          <p>Loading skills...</p>

        </div>
      </div>
    );
  }

  return (
    <div className="skills-page">

      <div className="skills-card">

        <div className="skills-header">

          <div className="skills-icon">
            ⚡
          </div>

          <h1>Select Your Skills</h1>

          <p>
            Choose the technologies and skills you know.
            We'll use them to find better job matches for you.
          </p>

        </div>

        {error && (
          <div className="skills-error">
            ✕ {error}
          </div>
        )}

        <div className="selected-count">

          <strong>
            {selectedSkills.length}
          </strong>

          <span>
            skills selected
          </span>

        </div>

        <div className="skills-grid">

          {skills.map((skill) => {

            const isSelected =
              selectedSkills.includes(
                skill.id
              );

            return (
              <button
                key={skill.id}
                type="button"
                className={`skill-item ${
                  isSelected
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  toggleSkill(skill.id)
                }
              >

                <span className="skill-check">
                  {isSelected ? "✓" : ""}
                </span>

                <span>
                  {skill.name}
                </span>

              </button>
            );
          })}

        </div>

        <button
          className="save-skills-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving Skills..."
            : "Save & Get Recommendations →"}
        </button>

      </div>

    </div>
  );
}

export default Skills;
