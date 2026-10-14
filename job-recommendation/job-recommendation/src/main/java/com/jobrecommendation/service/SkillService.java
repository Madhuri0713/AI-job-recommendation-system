package com.jobrecommendation.service;

import com.jobrecommendation.entity.Skill;
import com.jobrecommendation.repository.SkillRepository;
import com.jobrecommendation.exception.DuplicateResourceException;
import com.jobrecommendation.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    // Create a new skill
    public Skill createSkill(Skill skill) {

        String skillName = skill.getName().trim();
        skill.setName(skillName);

        if (skillRepository.findByNameIgnoreCase(skillName).isPresent()) {
            throw new DuplicateResourceException("Skill already exists");
        }

        return skillRepository.save(skill);
    }

    // Get all skills
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    // Get skill by ID
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Skill not found"));
    }

    // Update an existing skill
    @Transactional
    public Skill updateSkill(Long id, Skill updatedSkill) {

        Skill existingSkill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Skill not found"));

        String skillName = updatedSkill.getName().trim();

        if (skillRepository.findByNameIgnoreCase(skillName)
                .filter(skill -> !skill.getId().equals(id))
                .isPresent()) {

            throw new DuplicateResourceException("Skill already exists");
        }

        existingSkill.setName(skillName);

        try {
            return skillRepository.saveAndFlush(existingSkill);
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException("Skill already exists");
        }
    }

    // Delete a skill
    public void deleteSkill(Long id) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Skill not found"));

        skillRepository.delete(skill);
    }
}