package com.jobrecommendation.service;

import com.jobrecommendation.entity.User;
import com.jobrecommendation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.jobrecommendation.dto.UserResponseDTO;
import com.jobrecommendation.exception.DuplicateResourceException;
import com.jobrecommendation.exception.ResourceNotFoundException;
import com.jobrecommendation.exception.InvalidCredentialsException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );
        user.setRole("USER");
        return userRepository.save(user);
    }
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    public User updateUser(Long id, User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(
                passwordEncoder.encode(updatedUser.getPassword())
        );
        existingUser.setRole(updatedUser.getRole());

        return userRepository.save(existingUser);
    }
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }

        userRepository.deleteById(id);
    }
    public User loginUser(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        )
                );

        boolean passwordMatches =
                passwordEncoder.matches(password, user.getPassword());

        if (!passwordMatches) {
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        return user;
    }
}
