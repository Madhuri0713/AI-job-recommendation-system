package com.jobrecommendation.controller;

import com.jobrecommendation.dto.JobSkillResponseDTO;
import com.jobrecommendation.service.JobSkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-skills")
public class JobSkillController {

    private final JobSkillService jobSkillService;

    public JobSkillController(JobSkillService jobSkillService) {
        this.jobSkillService = jobSkillService;
    }

    @PostMapping("/{jobId}/{skillId}")
    public JobSkillResponseDTO addSkillToJob(
            @PathVariable Long jobId,
            @PathVariable Long skillId) {

        return jobSkillService.addSkillToJob(jobId, skillId);
    }

    @GetMapping
    public List<JobSkillResponseDTO> getAllJobSkills() {
        return jobSkillService.getAllJobSkills();
    }
    @DeleteMapping("/{id}")
    public String deleteJobSkill(@PathVariable Long id) {

        jobSkillService.deleteJobSkill(id);

        return "Job skill deleted successfully";
    }
}