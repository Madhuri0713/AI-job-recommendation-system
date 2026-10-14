package com.jobrecommendation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Pattern(
            regexp = "^[+]?[0-9\\s()-]{7,20}$",
            message = "Please provide a valid phone number"
    )
    private String phone;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @NotBlank(message = "Education is required")
    @Size(max = 150, message = "Education cannot exceed 150 characters")
    private String education;

    @Size(max = 50, message = "Experience cannot exceed 50 characters")
    private String experience;

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

    public User getUser() {
        return user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setUser(User user) {
        this.user = user;
    }
}