package com.jobrecommendation.controller;

import com.jobrecommendation.entity.Skill;
import com.jobrecommendation.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    public Skill createSkill(@Valid @RequestBody Skill skill) {
        return skillService.createSkill(skill);
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Long id) {
        return skillService.getSkillById(id);
    }

    @PutMapping("/{id}")
    public Skill updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody Skill skill) {

        return skillService.updateSkill(id, skill);
    }

    @DeleteMapping("/{id}")
    public String deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return "Skill deleted successfully";
    }
}