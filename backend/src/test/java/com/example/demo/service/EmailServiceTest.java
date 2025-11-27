package com.example.demo.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.example.demo.model.Appliance;
import com.example.demo.model.User;

class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendMaintenanceAlert() {
        // Arrange
        User testUser = User.builder()
            .id(1L)
            .name("John Doe")
            .email("john@example.com")
            .build();

        Appliance testAppliance = Appliance.builder()
            .id(1L)
            .name("Refrigerator")
            .description("Kitchen fridge")
            .build();

        // Act
        emailService.sendMaintenanceAlert(testUser, testAppliance);

        // Assert
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendMaintenanceAlert_HandlesException() {
        // Arrange
        User testUser = User.builder()
            .id(1L)
            .name("John Doe")
            .email("invalid-email")
            .build();

        Appliance testAppliance = Appliance.builder()
            .id(1L)
            .name("Refrigerator")
            .build();

        doThrow(new RuntimeException("Mail server error"))
            .when(mailSender).send(any(SimpleMailMessage.class));

        // Act - should not throw exception due to try-catch
        emailService.sendMaintenanceAlert(testUser, testAppliance);

        // Assert
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
