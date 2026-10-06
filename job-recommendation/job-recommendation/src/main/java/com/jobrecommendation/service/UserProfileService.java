package com.jobrecommendation.service;

import com.jobrecommendation.entity.UserProfile;
import com.jobrecommendation.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import com.jobrecommendation.entity.User;
import com.jobrecommendation.repository.UserRepository;

@Service

public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(
            UserProfileRepository userProfileRepository,
            UserRepository userRepository) {

        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfile createProfile(Long userId, UserProfile userProfile) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userProfile.setUser(user);

        return userProfileRepository.save(userProfile);
    }
    public UserProfile getProfile(Long userId) {

        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
    public UserProfile updateProfile(Long userId, UserProfile updatedProfile) {

        UserProfile existingProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingProfile.setPhone(updatedProfile.getPhone());
        existingProfile.setLocation(updatedProfile.getLocation());
        existingProfile.setEducation(updatedProfile.getEducation());
        existingProfile.setExperience(updatedProfile.getExperience());
        existingProfile.setBio(updatedProfile.getBio());

        return userProfileRepository.save(existingProfile);
    }
    public void deleteProfile(Long userId) {

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        userProfileRepository.delete(profile);
    }
}
