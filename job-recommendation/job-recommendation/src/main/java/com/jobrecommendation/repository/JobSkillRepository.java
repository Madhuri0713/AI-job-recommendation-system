package com.jobrecommendation.repository;

import com.jobrecommendation.entity.JobSkill;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {

    Optional<JobSkill> findByJobIdAndSkillId(Long jobId, Long skillId);

    List<JobSkill> findByJobId(Long jobId);

    @Override
    @EntityGraph(attributePaths = {"job", "skill"})
    List<JobSkill> findAll();
}