package com.jobrecommendation.dto;

public class UserProfileResponseDTO {
    private Long id;
    private String phone;
    private String location;
    private String education;
    private String experience;
    private String bio;
    private Long userId;

    public UserProfileResponseDTO(
            Long id,
            String phone,
            String location,
            String education,
            String experience,
            String bio,
            Long userId) {

        this.id = id;
        this.phone = phone;
        this.location = location;
        this.education = education;
        this.experience = experience;
        this.bio = bio;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getEducation() {
        return education;
    }

    public String getExperience() {
        return experience;
    }

    public String getBio() {
        return bio;
    }

    public Long getUserId() {
        return userId;
    }
}
