package com.jobrecommendation.dto;

import java.util.List;

public class RecommendationResponseDTO {

    private Long jobId;
    private String jobTitle;
    private String company;
    private String location;

    private int matchingSkills;
    private int totalRequiredSkills;

    private List<String> matchingSkillNames;
    private List<String> missingSkillNames;

    private double skillMatchPercentage;
    private boolean experienceMatch;
    private boolean locationMatch;
    private boolean educationMatch;

    private double matchPercentage;

    public RecommendationResponseDTO(
            Long jobId,
            String jobTitle,
            String company,
            String location,
            int matchingSkills,
            int totalRequiredSkills,
            List<String> matchingSkillNames,
            List<String> missingSkillNames,
            double skillMatchPercentage,
            boolean experienceMatch,
            boolean locationMatch,
            boolean educationMatch,
            double matchPercentage) {

        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.location = location;

        this.matchingSkills = matchingSkills;
        this.totalRequiredSkills = totalRequiredSkills;

        this.matchingSkillNames = matchingSkillNames;
        this.missingSkillNames = missingSkillNames;

        this.skillMatchPercentage = skillMatchPercentage;
        this.experienceMatch = experienceMatch;
        this.locationMatch = locationMatch;
        this.educationMatch = educationMatch;

        this.matchPercentage = matchPercentage;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public String getLocation() {
        return location;
    }

    public int getMatchingSkills() {
        return matchingSkills;
    }

    public int getTotalRequiredSkills() {
        return totalRequiredSkills;
    }

    public List<String> getMatchingSkillNames() {
        return matchingSkillNames;
    }

    public List<String> getMissingSkillNames() {
        return missingSkillNames;
    }

    public double getSkillMatchPercentage() {
        return skillMatchPercentage;
    }

    public boolean isExperienceMatch() {
        return experienceMatch;
    }

    public boolean isLocationMatch() {
        return locationMatch;
    }

    public boolean isEducationMatch() {
        return educationMatch;
    }

    public double getMatchPercentage() {
        return matchPercentage;
    }
}