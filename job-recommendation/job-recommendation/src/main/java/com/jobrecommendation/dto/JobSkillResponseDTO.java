package com.jobrecommendation.dto;

public class JobSkillResponseDTO {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long skillId;
    private String skillName;

    public JobSkillResponseDTO(
            Long id,
            Long jobId,
            String jobTitle,
            Long skillId,
            String skillName) {

        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.skillId = skillId;
        this.skillName = skillName;
    }

    public Long getId() {
        return id;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public Long getSkillId() {
        return skillId;
    }

    public String getSkillName() {
        return skillName;
    }
}