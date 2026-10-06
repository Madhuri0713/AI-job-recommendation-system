package com.jobrecommendation.controller;

import com.jobrecommendation.dto.RecommendationResponseDTO;
import com.jobrecommendation.service.RecommendationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @GetMapping
    public List<RecommendationResponseDTO> getRecommendations(
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        return recommendationService.getRecommendations(userId);
    }
}
