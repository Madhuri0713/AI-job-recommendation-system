package com.jobrecommendation.controller;

import com.jobrecommendation.dto.LoginRequestDTO;
import com.jobrecommendation.dto.UserResponseDTO;
import com.jobrecommendation.entity.User;
import com.jobrecommendation.service.JwtService;
import com.jobrecommendation.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Register a new user
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(
            @Valid @RequestBody User user) {

        User savedUser = userService.createUser(user);

        UserResponseDTO response = new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return ResponseEntity.ok(response);
    }

    // Get all users
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id)
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update user
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        User updatedUser = userService.updateUser(id, user);

        return new UserResponseDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole()
        );
    }

    // Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> login(
           @Valid @RequestBody LoginRequestDTO loginRequest) {

        User user = userService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Login successful",
                        "token", token,
                        "userId", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        );
    }
}