package com.jobrecommendation.controller;

import com.jobrecommendation.dto.UserSkillResponseDTO;
import com.jobrecommendation.service.UserSkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-skills")
public class UserSkillController {

    private final UserSkillService userSkillService;

    public UserSkillController(UserSkillService userSkillService) {
        this.userSkillService = userSkillService;
    }

    @PostMapping("/{userId}/{skillId}")
    public UserSkillResponseDTO addSkillToUser(
            @PathVariable Long userId,
            @PathVariable Long skillId) {

        return userSkillService.addSkillToUser(userId, skillId);
    }

    @GetMapping
    public List<UserSkillResponseDTO> getAllUserSkills() {
        return userSkillService.getAllUserSkills();
    }
}