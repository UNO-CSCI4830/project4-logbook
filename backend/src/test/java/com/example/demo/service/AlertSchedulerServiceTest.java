package com.example.demo.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.demo.model.Appliance;
import com.example.demo.model.User;
import com.example.demo.repository.ApplianceRepository;
import com.example.demo.repository.UserRepository;

class AlertSchedulerServiceTest {

    @Mock
    private ApplianceRepository applianceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AlertSchedulerService alertSchedulerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCheckAndSendAlerts_WithValidData() {
        // Arrange
        User testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        Appliance testAppliance = Appliance.builder()
            .id(1L)
            .name("Test Refrigerator")
            .description("Needs maintenance")
            .alertDate(new Date())
            .userId(1L)
            .build();

        when(applianceRepository.findByAlertDate(any(Date.class)))
            .thenReturn(Arrays.asList(testAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(applianceRepository, times(1)).findByAlertDate(any(Date.class));
        verify(userRepository, times(1)).findById(1L);
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, testAppliance);
    }

    @Test
    void testCheckAndSendAlerts_NoAlerts() {
        // Arrange
        when(applianceRepository.findByAlertDate(any(Date.class)))
            .thenReturn(Arrays.asList());

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(applianceRepository, times(1)).findByAlertDate(any(Date.class));
        verify(emailService, never()).sendMaintenanceAlert(any(), any());
    }

    @Test
    void testCheckAndSendAlerts_UserNotFound() {
        // Arrange
        Appliance testAppliance = Appliance.builder()
            .id(1L)
            .name("Test Refrigerator")
            .userId(999L)
            .build();

        when(applianceRepository.findByAlertDate(any(Date.class)))
            .thenReturn(Arrays.asList(testAppliance));
        when(userRepository.findById(999L))
            .thenReturn(Optional.empty());

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, never()).sendMaintenanceAlert(any(), any());
    }

    @Test
    void testCheckAndSendAlerts_MultipleAppliances() {
        // Arrange - Test that multiple appliances on same day all get processed
        User user1 = User.builder()
            .id(1L)
            .name("User One")
            .email("user1@example.com")
            .build();

        User user2 = User.builder()
            .id(2L)
            .name("User Two")
            .email("user2@example.com")
            .build();

        Appliance appliance1 = Appliance.builder()
            .id(1L)
            .name("Refrigerator")
            .description("Fridge maintenance")
            .alertDate(new Date())
            .userId(1L)
            .build();

        Appliance appliance2 = Appliance.builder()
            .id(2L)
            .name("Dishwasher")
            .description("Dishwasher maintenance")
            .alertDate(new Date())
            .userId(2L)
            .build();

        Appliance appliance3 = Appliance.builder()
            .id(3L)
            .name("Oven")
            .description("Oven maintenance")
            .alertDate(new Date())
            .userId(1L)
            .build();

        when(applianceRepository.findByAlertDate(any(Date.class)))
            .thenReturn(Arrays.asList(appliance1, appliance2, appliance3));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(user1));
        when(userRepository.findById(2L))
            .thenReturn(Optional.of(user2));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(applianceRepository, times(1)).findByAlertDate(any(Date.class));
        verify(userRepository, times(2)).findById(1L); // User 1 has 2 appliances
        verify(userRepository, times(1)).findById(2L); // User 2 has 1 appliance
        verify(emailService, times(1)).sendMaintenanceAlert(user1, appliance1);
        verify(emailService, times(1)).sendMaintenanceAlert(user2, appliance2);
        verify(emailService, times(1)).sendMaintenanceAlert(user1, appliance3);
        verify(emailService, times(3)).sendMaintenanceAlert(any(), any()); // Total 3 emails sent
    }

    @Test
    void testCheckAndSendAlerts_MixedValidAndInvalidUsers() {
        // Arrange - Test partial success: some users exist, some don't
        User validUser = User.builder()
            .id(1L)
            .name("Valid User")
            .email("valid@example.com")
            .build();

        Appliance validAppliance = Appliance.builder()
            .id(1L)
            .name("Working Appliance")
            .userId(1L)
            .build();

        Appliance orphanedAppliance = Appliance.builder()
            .id(2L)
            .name("Orphaned Appliance")
            .userId(999L)
            .build();

        when(applianceRepository.findByAlertDate(any(Date.class)))
            .thenReturn(Arrays.asList(validAppliance, orphanedAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(validUser));
        when(userRepository.findById(999L))
            .thenReturn(Optional.empty());

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, times(1)).sendMaintenanceAlert(validUser, validAppliance);
        verify(emailService, times(1)).sendMaintenanceAlert(any(), any()); // Only 1 email sent
        // Orphaned appliance should not trigger email
    }
}
