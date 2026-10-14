package com.jobrecommendation.controller;

import com.jobrecommendation.dto.UserProfileResponseDTO;
import com.jobrecommendation.entity.UserProfile;
import com.jobrecommendation.security.UserAuthorizationService;
import com.jobrecommendation.service.UserProfileService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserAuthorizationService userAuthorizationService;

    public UserProfileController(
            UserProfileService userProfileService,
            UserAuthorizationService userAuthorizationService) {

        this.userProfileService = userProfileService;
        this.userAuthorizationService = userAuthorizationService;
    }

    @PostMapping("/{userId}")
    public UserProfileResponseDTO createProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserProfile userProfile) {

        // Check whether logged-in user owns this userId
        userAuthorizationService.checkUserAccess(userId);

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
    public UserProfileResponseDTO getProfile(
            @PathVariable Long userId) {

        // Check whether logged-in user owns this userId
        userAuthorizationService.checkUserAccess(userId);

        UserProfile profile =
                userProfileService.getProfile(userId);

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
            @Valid @RequestBody UserProfile userProfile) {

        // Check whether logged-in user owns this userId
        userAuthorizationService.checkUserAccess(userId);

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
    public String deleteProfile(
            @PathVariable Long userId) {

        // Check whether logged-in user owns this userId
        userAuthorizationService.checkUserAccess(userId);

        userProfileService.deleteProfile(userId);

        return "Profile deleted successfully";
    }
}