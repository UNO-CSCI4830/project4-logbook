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
}
