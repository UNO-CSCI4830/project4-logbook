package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import com.example.demo.model.User;
import com.example.demo.model.UpdateProfileRequest;
import com.example.demo.model.ChangePasswordRequest;
import com.example.demo.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://myappliancelogbook.com"
})
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public List<User> getAll() {
    return userService.getAllUsers();
      
  }

  @PostMapping
  public User create(@RequestBody User user) {
    System.out.println(user);
    return userService.saveUser(user);
  }

  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
    try {
      String email = extractEmailFromToken(authHeader);
      User user = userService.getUserByEmail(email);
      if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
      }
      // Don't send password to frontend
      user.setPassword(null);
      return ResponseEntity.ok(user);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
  }

  @PutMapping("/me")
  public ResponseEntity<?> updateProfile(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody UpdateProfileRequest request) {
    try {
      String email = extractEmailFromToken(authHeader);
      User user = userService.getUserByEmail(email);

      if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
      }

      // Update name if provided
      if (request.getName() != null && !request.getName().isEmpty()) {
        user.setName(request.getName());
      }

      // Update first name if provided
      if (request.getFirstName() != null) {
        user.setFirstName(request.getFirstName().isEmpty() ? null : request.getFirstName());
      }

      // Update last name if provided
      if (request.getLastName() != null) {
        user.setLastName(request.getLastName().isEmpty() ? null : request.getLastName());
      }

      // Update birthday if provided
      if (request.getBirthday() != null) {
        user.setBirthday(request.getBirthday());
      }

      // Update profile picture URL if provided
      if (request.getProfilePictureUrl() != null) {
        user.setProfilePictureUrl(request.getProfilePictureUrl().isEmpty() ? null : request.getProfilePictureUrl());
      }

      // Update email if provided and different
      if (request.getEmail() != null && !request.getEmail().isEmpty()) {
        // Check if new email is already taken by another user
        User existingUser = userService.getUserByEmail(request.getEmail());
        if (existingUser != null && !existingUser.getId().equals(user.getId())) {
          return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
        }
        user.setEmail(request.getEmail());
      }

      User updatedUser = userService.updateUser(user);
      updatedUser.setPassword(null); // Don't send password
      return ResponseEntity.ok(updatedUser);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
  }

  @PutMapping("/me/password")
  public ResponseEntity<?> changePassword(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody ChangePasswordRequest request) {
    try {
      String email = extractEmailFromToken(authHeader);
      User user = userService.getUserByEmail(email);

      if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
      }

      // Verify current password
      if (!user.getPassword().equals(request.getCurrentPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
      }

      // Update password
      user.setPassword(request.getNewPassword());
      userService.updateUser(user);

      return ResponseEntity.ok("Password changed successfully");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
  }

  private String extractEmailFromToken(String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String secret = "superduperextremelysecurekeyfortheapp1";
    Key hmacKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                                    SignatureAlgorithm.HS256.getJcaName());

    Claims claims = Jwts.parserBuilder()
        .setSigningKey(hmacKey)
        .build()
        .parseClaimsJws(token)
        .getBody();

    return claims.getSubject();
  }
}
