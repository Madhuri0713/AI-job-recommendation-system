package com.jobrecommendation.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import com.jobrecommendation.exception.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.jobrecommendation.exception.InvalidCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 409 - Duplicate resource
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(
            DuplicateResourceException exception) {

        ErrorResponse errorResponse = new ErrorResponse(
                409,
                exception.getMessage()
        );

        return ResponseEntity
                .status(409)
                .body(errorResponse);
    }

    // 403 - Access denied
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException exception) {

        ErrorResponse errorResponse = new ErrorResponse(
                403,
                exception.getMessage()
        );

        return ResponseEntity
                .status(403)
                .body(errorResponse);
    }

    // 404 - Resource not found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException exception) {

        ErrorResponse errorResponse = new ErrorResponse(
                404,
                exception.getMessage()
        );

        return ResponseEntity
                .status(404)
                .body(errorResponse);
    }
// 401 - Invalid login credentials
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException exception) {

        ErrorResponse errorResponse = new ErrorResponse(
                401,
                exception.getMessage()
        );

        return ResponseEntity
                .status(401)
                .body(errorResponse);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .filter(java.util.Objects::nonNull)
                .findFirst()
                .orElse("Invalid input");

        return ResponseEntity.badRequest()
                .body(new ErrorResponse(400, message));
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception) {

        ErrorResponse error = new ErrorResponse(
                409,
                "Duplicate or conflicting data"
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

}