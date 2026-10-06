package com.jobrecommendation.service;

import com.jobrecommendation.dto.RecommendationResponseDTO;
import com.jobrecommendation.entity.Job;
import com.jobrecommendation.entity.JobSkill;
import com.jobrecommendation.entity.UserProfile;
import com.jobrecommendation.entity.UserSkill;
import com.jobrecommendation.repository.JobRepository;
import com.jobrecommendation.repository.JobSkillRepository;
import com.jobrecommendation.repository.UserProfileRepository;
import com.jobrecommendation.repository.UserSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final JobRepository jobRepository;
    private final UserSkillRepository userSkillRepository;
    private final JobSkillRepository jobSkillRepository;
    private final UserProfileRepository userProfileRepository;

    public RecommendationService(
            JobRepository jobRepository,
            UserSkillRepository userSkillRepository,
            JobSkillRepository jobSkillRepository,
            UserProfileRepository userProfileRepository) {

        this.jobRepository = jobRepository;
        this.userSkillRepository = userSkillRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public List<RecommendationResponseDTO> getRecommendations(Long userId) {

        // 1. Get user's profile
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("User profile not found"));

        // 2. Get all skills of the user
        List<UserSkill> userSkills =
                userSkillRepository.findByUserId(userId);

        // 3. Convert user's skill names into a normalized Set
        Set<String> userSkillNames = userSkills.stream()
                .map(userSkill ->
                        normalizeSkillName(
                                userSkill.getSkill().getName()))
                .collect(Collectors.toSet());

        // 4. Get all jobs
        List<Job> jobs = jobRepository.findAll();

        // 5. Get all job skills only once
        Map<Long, List<JobSkill>> jobSkillsByJobId =
                jobSkillRepository.findAll()
                        .stream()
                        .collect(Collectors.groupingBy(
                                jobSkill ->
                                        jobSkill.getJob().getId()
                        ));

        // 6. Calculate match for every job
        return jobs.stream()
                .map(job -> {

                    // Get skills required by this job
                    List<JobSkill> jobSkills =
                            jobSkillsByJobId.getOrDefault(
                                    job.getId(),
                                    List.of()
                            );

                    int totalRequiredSkills =
                            jobSkills.size();

                    // Get matching skill names
                    List<String> matchingSkillNames =
                            jobSkills.stream()
                                    .filter(jobSkill ->
                                            userSkillNames.contains(
                                                    normalizeSkillName(
                                                            jobSkill.getSkill().getName())))
                                    .map(jobSkill ->
                                            jobSkill.getSkill().getName())
                                    .toList();

// Get missing skill names
                    List<String> missingSkillNames =
                            jobSkills.stream()
                                    .filter(jobSkill ->
                                            !userSkillNames.contains(
                                                    normalizeSkillName(
                                                            jobSkill.getSkill().getName())))
                                    .map(jobSkill ->
                                            jobSkill.getSkill().getName())
                                    .toList();

                    // Count matching skills
                    int matchingSkills = matchingSkillNames.size();

                    // Calculate skill percentage
                    double skillScore = 0;

                    if (totalRequiredSkills > 0) {
                        skillScore =
                                ((double) matchingSkills
                                        / totalRequiredSkills) * 100;
                    }

                    // Check experience match
                    boolean experienceMatch =
                            isExperienceMatch(
                                    userProfile.getExperience(),
                                    job.getExperienceRequired());

                    // Experience score
                    double experienceScore =
                            experienceMatch ? 100 : 0;

                    // Check location match
                    boolean locationMatch =
                            userProfile.getLocation() != null
                                    && job.getLocation() != null
                                    && userProfile.getLocation()
                                    .equalsIgnoreCase(
                                            job.getLocation());

                    // Location score
                    double locationScore =
                            locationMatch ? 100 : 0;

                    // Check education match
                    boolean educationMatch =
                            userProfile.getEducation() != null
                                    && job.getEducationRequired() != null
                                    && normalizeEducation(
                                    userProfile.getEducation())
                                    .equals(
                                            normalizeEducation(
                                                    job.getEducationRequired()));

                    // Education score
                    double educationScore =
                            educationMatch ? 100 : 0;

                    // Final weighted score
                    double matchPercentage =
                            (skillScore * 0.60)
                                    + (experienceScore * 0.15)
                                    + (educationScore * 0.15)
                                    + (locationScore * 0.10);

                    return new RecommendationResponseDTO(
                            job.getId(),
                            job.getTitle(),
                            job.getCompany(),
                            job.getLocation(),
                            matchingSkills,
                            totalRequiredSkills,
                            matchingSkillNames,
                            missingSkillNames,
                            skillScore,
                            experienceMatch,
                            locationMatch,
                            educationMatch,
                            matchPercentage
                    );
                })
                .sorted((job1, job2) ->
                        Double.compare(
                                job2.getMatchPercentage(),
                                job1.getMatchPercentage()))
                .toList();
    }

    private String normalizeSkillName(String skillName) {

        if (skillName == null) {
            return "";
        }

        return skillName
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", "");
    }

    private boolean isExperienceMatch(String userExperience,
                                      String jobExperience) {

        if (userExperience == null || jobExperience == null) {
            return false;
        }

        userExperience =
                normalizeExperience(userExperience);

        jobExperience =
                normalizeExperience(jobExperience);

        try {

            // Fresher means 0 years
            if (userExperience.equals("fresher")) {
                userExperience = "0-0";
            }

            if (jobExperience.equals("fresher")) {
                jobExperience = "0-0";
            }

            String[] userParts =
                    userExperience.split("-");

            String[] jobParts =
                    jobExperience.split("-");

            // Current project format:
            // 0-2, 1-3, 3-5
            if (userParts.length == 2
                    && jobParts.length == 2) {

                int userMin =
                        Integer.parseInt(
                                userParts[0].trim());

                int userMax =
                        Integer.parseInt(
                                userParts[1].trim());

                int jobMin =
                        Integer.parseInt(
                                jobParts[0].trim());

                int jobMax =
                        Integer.parseInt(
                                jobParts[1].trim());

                // Check whether the experience
                // ranges overlap
                return userMin <= jobMax
                        && jobMin <= userMax;
            }

        } catch (NumberFormatException e) {

            // Invalid experience format
            return false;
        }

        return false;
    }

    private String normalizeExperience(
            String experience) {

        return experience
                .trim()
                .toLowerCase()
                .replace("years", "")
                .replace("year", "")
                .trim();
    }

    private String normalizeEducation(
            String education) {

        if (education == null) {
            return "";
        }

        return education
                .trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9]", "");
    }
}