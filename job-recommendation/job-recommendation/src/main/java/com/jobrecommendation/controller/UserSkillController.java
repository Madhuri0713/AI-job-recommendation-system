package com.jobrecommendation.controller;

import com.jobrecommendation.dto.UserSkillResponseDTO;
import com.jobrecommendation.service.UserSkillService;
import org.springframework.web.bind.annotation.*;
import com.jobrecommendation.security.UserAuthorizationService;

import java.util.List;

@RestController
@RequestMapping("/api/user-skills")
public class UserSkillController {

    private final UserSkillService userSkillService;
    private final UserAuthorizationService userAuthorizationService;

    public UserSkillController(
            UserSkillService userSkillService,
            UserAuthorizationService userAuthorizationService) {

        this.userSkillService = userSkillService;
        this.userAuthorizationService = userAuthorizationService;
    }
    @PostMapping("/{userId}/{skillId}")
    public UserSkillResponseDTO addSkillToUser(
            @PathVariable Long userId,
            @PathVariable Long skillId) {

        userAuthorizationService.checkUserAccess(userId);

        return userSkillService.addSkillToUser(userId, skillId);
    }

    @GetMapping
    public List<UserSkillResponseDTO> getAllUserSkills() {
        return userSkillService.getAllUserSkills();
    }
    @GetMapping("/{userId}")
    public List<UserSkillResponseDTO> getUserSkills(
            @PathVariable Long userId) {

        userAuthorizationService.checkUserAccess(userId);

        return userSkillService.getUserSkills(userId);
    }
    @DeleteMapping("/{userId}/{skillId}")
    public String deleteUserSkill(
            @PathVariable Long userId,
            @PathVariable Long skillId) {

        userAuthorizationService.checkUserAccess(userId);

        userSkillService.deleteUserSkill(userId, skillId);

        return "User skill deleted successfully";
    }
}