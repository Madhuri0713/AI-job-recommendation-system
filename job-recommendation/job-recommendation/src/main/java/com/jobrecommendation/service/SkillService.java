package com.jobrecommendation.service;


import com.jobrecommendation.entity.Skill;
import com.jobrecommendation.repository.SkillRepository;
import org.springframework.stereotype.Service;
import com.jobrecommendation.exception.DuplicateResourceException;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public Skill createSkill(Skill skill) {

        skill.setName(skill.getName().trim());

        if (skillRepository.findByNameIgnoreCase(skill.getName()).isPresent()) {
            throw new DuplicateResourceException("Skill already exists");
        }

        return skillRepository.save(skill);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    public Skill updateSkill(Long id, Skill updatedSkill) {
        Skill existingSkill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        existingSkill.setName(updatedSkill.getName());

        return skillRepository.save(existingSkill);
    }

    public void deleteSkill(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        skillRepository.delete(skill);
    }
}
