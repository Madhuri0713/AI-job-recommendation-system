package com.jobrecommendation.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthorizationService {

    public void checkUserAccess(Long requestedUserId) {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal() == null) {

            throw new AccessDeniedException(
                    "User is not authenticated"
            );
        }

        String authenticatedUserId =
                authentication.getPrincipal().toString();

        if (!authenticatedUserId.equals(
                requestedUserId.toString())) {

            throw new AccessDeniedException(
                    "You are not allowed to access another user's data"
            );
        }
    }
}

