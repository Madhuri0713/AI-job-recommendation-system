package com.jobrecommendation.controller;

import com.jobrecommendation.dto.UserProfileResponseDTO;
import com.jobrecommendation.entity.UserProfile;
import com.jobrecommendation.service.UserProfileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {
    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping("/{userId}")
    public UserProfileResponseDTO createProfile(
            @PathVariable Long userId,
            @RequestBody UserProfile userProfile) {

        UserProfile savedProfile =
                userProfileService.createProfile(userId, userProfile);

        return new UserProfileResponseDTO(
                savedProfile.getId(),
                savedProfile.getPhone(),
                savedProfile.getLocation(),
                savedProfile.getEducation(),
                savedProfile.getExperience(),
                savedProfile.getBio(),
                savedProfile.getUser().getId()
        );
    }
    @GetMapping("/{userId}")
    public UserProfileResponseDTO getProfile(@PathVariable Long userId) {

        UserProfile profile = userProfileService.getProfile(userId);

        return new UserProfileResponseDTO(
                profile.getId(),
                profile.getPhone(),
                profile.getLocation(),
                profile.getEducation(),
                profile.getExperience(),
                profile.getBio(),
                profile.getUser().getId()
        );
    }
    @PutMapping("/{userId}")
    public UserProfileResponseDTO updateProfile(
            @PathVariable Long userId,
            @RequestBody UserProfile userProfile) {

        UserProfile updatedProfile =
                userProfileService.updateProfile(userId, userProfile);

        return new UserProfileResponseDTO(
                updatedProfile.getId(),
                updatedProfile.getPhone(),
                updatedProfile.getLocation(),
                updatedProfile.getEducation(),
                updatedProfile.getExperience(),
                updatedProfile.getBio(),
                updatedProfile.getUser().getId()
        );
    }
    @DeleteMapping("/{userId}")
    public String deleteProfile(@PathVariable Long userId) {

        userProfileService.deleteProfile(userId);

        return "Profile deleted successfully";
    }
}
