package com.jobrecommendation.repository;

import com.jobrecommendation.entity.UserSkill;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    Optional<UserSkill> findByUserIdAndSkillId(Long userId, Long skillId);

    @EntityGraph(attributePaths = {"skill"})
    List<UserSkill> findByUserId(Long userId);
}