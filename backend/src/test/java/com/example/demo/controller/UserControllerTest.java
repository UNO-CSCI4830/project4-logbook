package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.demo.model.User;
import com.example.demo.model.UpdateProfileRequest;
import com.example.demo.model.ChangePasswordRequest;
import com.example.demo.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private String validToken;
    private String validAuthHeader;
    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test data
        testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .password("password123")
            .build();

        // Generate a real JWT token for testing
        String secret = "superduperextremelysecurekeyfortheapp1";
        Key hmacKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                                        SignatureAlgorithm.HS256.getJcaName());

        validToken = Jwts.builder()
                .setSubject("test@example.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(hmacKey)
                .compact();
        validAuthHeader = "Bearer " + validToken;
    }

    @Test
    void testGetCurrentUser_WithValidToken() {
        // Arrange
        when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);

        // Act
        ResponseEntity<?> response = userController.getCurrentUser(validAuthHeader);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        User returnedUser = (User) response.getBody();
        assertEquals("Test User", returnedUser.getName());
        assertEquals("test@example.com", returnedUser.getEmail());
        assertNull(returnedUser.getPassword()); // Password should be null

        verify(userService).getUserByEmail("test@example.com");
    }

    @Test
    void testGetCurrentUser_UserNotFound() {
        // Arrange
        when(userService.getUserByEmail("test@example.com")).thenReturn(null);

        // Act
        ResponseEntity<?> response = userController.getCurrentUser(validAuthHeader);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testUpdateProfile_NameOnly() {
        // Arrange
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Updated Name");
        request.setEmail("test@example.com");

        User updatedUser = User.builder()
            .id(1L)
            .name("Updated Name")
            .email("test@example.com")
            .password("password123")
            .build();

        when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
        when(userService.updateUser(any(User.class))).thenReturn(updatedUser);

        // Act
        ResponseEntity<?> response = userController.updateProfile(validAuthHeader, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        User returnedUser = (User) response.getBody();
        assertEquals("Updated Name", returnedUser.getName());
        assertNull(returnedUser.getPassword());

        verify(userService, times(2)).getUserByEmail("test@example.com");
        verify(userService).updateUser(any(User.class));
    }

    @Test
    void testUpdateProfile_EmailAlreadyInUse() {
        // Arrange
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Test User");
        request.setEmail("taken@example.com");

        User existingUser = User.builder()
            .id(2L)
            .email("taken@example.com")
            .build();

        when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
        when(userService.getUserByEmail("taken@example.com")).thenReturn(existingUser);

        // Act
        ResponseEntity<?> response = userController.updateProfile(validAuthHeader, request);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Email already in use", response.getBody());

        verify(userService).getUserByEmail("test@example.com");
        verify(userService).getUserByEmail("taken@example.com");
        verify(userService, never()).updateUser(any(User.class));
    }

    @Test
    void testUpdateProfile_EmailNotChanged_SameUser() {
        // Arrange
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Updated Name");
        request.setEmail("test@example.com"); // Same email

        User updatedUser = User.builder()
            .id(1L)
            .name("Updated Name")
            .email("test@example.com")
            .password("password123")
            .build();

        when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
        when(userService.updateUser(any(User.class))).thenReturn(updatedUser);

        // Act
        ResponseEntity<?> response = userController.updateProfile(validAuthHeader, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService).updateUser(any(User.class));
    }

    @Test
    void testChangePassword_Success() {
        // Arrange
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("password123");
        request.setNewPassword("newPassword456");

        when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
        when(userService.updateUser(any(User.class))).thenReturn(testUser);

        // Act
        ResponseEntity<?> response = userController.changePassword(validAuthHeader, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password changed successfully", response.getBody());

        verify(userService).getUserByEmail("test@example.com");
        verify(userService).updateUser(any(User.class));
    }

    @Test
    void testChangePassword_IncorrectCurrentPassword() {
        // Arrange
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrongPassword");
        request.setNewPassword("newPassword456");

        when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);

        // Act
        ResponseEntity<?> response = userController.changePassword(validAuthHeader, request);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Current password is incorrect", response.getBody());

        verify(userService).getUserByEmail("test@example.com");
        verify(userService, never()).updateUser(any(User.class));
    }

    @Test
    void testChangePassword_UserNotFound() {
        // Arrange
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("password123");
        request.setNewPassword("newPassword456");

        when(userService.getUserByEmail("test@example.com")).thenReturn(null);

        // Act
        ResponseEntity<?> response = userController.changePassword(validAuthHeader, request);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }
}
