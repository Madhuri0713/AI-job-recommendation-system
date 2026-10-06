package com.jobrecommendation.service;

import com.jobrecommendation.dto.UserSkillResponseDTO;
import com.jobrecommendation.entity.User;
import com.jobrecommendation.entity.Skill;
import com.jobrecommendation.entity.UserSkill;
import com.jobrecommendation.repository.UserRepository;
import com.jobrecommendation.repository.SkillRepository;
import com.jobrecommendation.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import com.jobrecommendation.exception.DuplicateResourceException;

import java.util.List;

@Service
public class UserSkillService {

    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public UserSkillService(
            UserSkillRepository userSkillRepository,
            UserRepository userRepository,
            SkillRepository skillRepository) {

        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    public UserSkillResponseDTO addSkillToUser(Long userId, Long skillId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        if (userSkillRepository.findByUserIdAndSkillId(userId, skillId).isPresent()) {
            throw new DuplicateResourceException("User already has this skill");
        }

        UserSkill userSkill = new UserSkill();

        userSkill.setUser(user);
        userSkill.setSkill(skill);

        UserSkill savedUserSkill = userSkillRepository.save(userSkill);

        return new UserSkillResponseDTO(
                savedUserSkill.getId(),
                user.getId(),
                user.getName(),
                skill.getId(),
                skill.getName()
        );
    }

    public List<UserSkillResponseDTO> getAllUserSkills() {

        return userSkillRepository.findAll()
                .stream()
                .map(userSkill -> new UserSkillResponseDTO(
                        userSkill.getId(),
                        userSkill.getUser().getId(),
                        userSkill.getUser().getName(),
                        userSkill.getSkill().getId(),
                        userSkill.getSkill().getName()
                ))
                .toList();
    }
}