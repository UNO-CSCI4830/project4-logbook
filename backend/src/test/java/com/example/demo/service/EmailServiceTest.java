package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
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

    @Test
    void testSendMaintenanceAlert_EmailContentCorrect() {
        // Arrange
        User testUser = User.builder()
            .id(1L)
            .name("Jane Smith")
            .email("jane@example.com")
            .build();

        Appliance testAppliance = Appliance.builder()
            .id(1L)
            .name("Washing Machine")
            .description("Front-load washer in laundry room")
            .build();

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        // Act
        emailService.sendMaintenanceAlert(testUser, testAppliance);

        // Assert
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();

        // Verify email recipient
        assertTrue(sentMessage.getTo()[0].equals("jane@example.com"),
            "Email should be sent to user's email");

        // Verify subject contains appliance name
        assertTrue(sentMessage.getSubject().contains("Washing Machine"),
            "Subject should contain appliance name");
        assertTrue(sentMessage.getSubject().contains("Maintenance Alert"),
            "Subject should mention maintenance alert");

        // Verify message body contains user name and appliance details
        String messageText = sentMessage.getText();
        assertTrue(messageText.contains("Jane Smith"),
            "Message should contain user's name");
        assertTrue(messageText.contains("Washing Machine"),
            "Message should contain appliance name");
        assertTrue(messageText.contains("Front-load washer in laundry room"),
            "Message should contain appliance description");
    }

    @Test
    void testSendMaintenanceAlert_WithNullDescription() {
        // Arrange - Test that email works even when description is null/empty
        User testUser = User.builder()
            .id(1L)
            .name("Bob Johnson")
            .email("bob@example.com")
            .build();

        Appliance testAppliance = Appliance.builder()
            .id(1L)
            .name("Microwave")
            .description(null) // No description provided
            .build();

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        // Act
        emailService.sendMaintenanceAlert(testUser, testAppliance);

        // Assert
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();

        // Verify email is still sent with valid content
        assertTrue(sentMessage.getTo()[0].equals("bob@example.com"),
            "Email should be sent even without description");
        assertTrue(sentMessage.getSubject().contains("Microwave"),
            "Subject should contain appliance name");

        String messageText = sentMessage.getText();
        assertTrue(messageText.contains("Bob Johnson"),
            "Message should contain user's name");
        assertTrue(messageText.contains("Microwave"),
            "Message should contain appliance name");
        // Description should not appear in message since it's null
        assertTrue(!messageText.contains("Description: null"),
            "Message should not show 'Description: null'");
    }
}
