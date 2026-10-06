package com.jobrecommendation.service;

import com.jobrecommendation.dto.JobSkillResponseDTO;
import com.jobrecommendation.entity.Job;
import com.jobrecommendation.entity.Skill;
import com.jobrecommendation.entity.JobSkill;
import com.jobrecommendation.repository.JobRepository;
import com.jobrecommendation.repository.SkillRepository;
import com.jobrecommendation.repository.JobSkillRepository;
import com.jobrecommendation.exception.DuplicateResourceException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobSkillService {

    private final JobSkillRepository jobSkillRepository;
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;

    public JobSkillService(
            JobSkillRepository jobSkillRepository,
            JobRepository jobRepository,
            SkillRepository skillRepository) {

        this.jobSkillRepository = jobSkillRepository;
        this.jobRepository = jobRepository;
        this.skillRepository = skillRepository;
    }

    public JobSkillResponseDTO addSkillToJob(Long jobId, Long skillId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (jobSkillRepository.findByJobIdAndSkillId(jobId, skillId).isPresent()) {
            throw new DuplicateResourceException(
                    "Job already has this skill"
            );
        }

        JobSkill jobSkill = new JobSkill();

        jobSkill.setJob(job);
        jobSkill.setSkill(skill);

        JobSkill savedJobSkill = jobSkillRepository.save(jobSkill);

        return new JobSkillResponseDTO(
                savedJobSkill.getId(),
                job.getId(),
                job.getTitle(),
                skill.getId(),
                skill.getName()
        );
    }
    public List<JobSkillResponseDTO> getAllJobSkills() {

        return jobSkillRepository.findAll()
                .stream()
                .map(jobSkill -> new JobSkillResponseDTO(
                        jobSkill.getId(),
                        jobSkill.getJob().getId(),
                        jobSkill.getJob().getTitle(),
                        jobSkill.getSkill().getId(),
                        jobSkill.getSkill().getName()
                ))
                .toList();
    }
    public void deleteJobSkill(Long id) {

        JobSkill jobSkill = jobSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("JobSkill not found"));

        jobSkillRepository.delete(jobSkill);
    }
}