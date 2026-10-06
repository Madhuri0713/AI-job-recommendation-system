package com.jobrecommendation.dto;

public class UserSkillResponseDTO {

    private Long id;
    private Long userId;
    private String userName;
    private Long skillId;
    private String skillName;

    public UserSkillResponseDTO(
            Long id,
            Long userId,
            String userName,
            Long skillId,
            String skillName) {

        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.skillId = skillId;
        this.skillName = skillName;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public Long getSkillId() {
        return skillId;
    }

    public String getSkillName() {
        return skillName;
    }
}