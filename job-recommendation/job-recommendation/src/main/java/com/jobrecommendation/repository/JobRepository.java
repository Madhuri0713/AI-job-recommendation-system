package com.jobrecommendation.repository;

import com.jobrecommendation.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}
