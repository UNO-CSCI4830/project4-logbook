package com.example.demo.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
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
            .alertDate(LocalDate.now())
            .userId(1L)
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(testAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(applianceRepository, times(1)).findByAlertDateBefore(any(LocalDate.class));
        verify(userRepository, times(1)).findById(1L);
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, testAppliance);
    }

    @Test
    void testCheckAndSendAlerts_NoAlerts() {
        // Arrange
        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList());

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(applianceRepository, times(1)).findByAlertDateBefore(any(LocalDate.class));
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

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
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
            .alertDate(LocalDate.now())
            .userId(1L)
            .build();

        Appliance appliance2 = Appliance.builder()
            .id(2L)
            .name("Dishwasher")
            .description("Dishwasher maintenance")
            .alertDate(LocalDate.now())
            .userId(2L)
            .build();

        Appliance appliance3 = Appliance.builder()
            .id(3L)
            .name("Oven")
            .description("Oven maintenance")
            .alertDate(LocalDate.now())
            .userId(1L)
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(appliance1, appliance2, appliance3));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(user1));
        when(userRepository.findById(2L))
            .thenReturn(Optional.of(user2));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(applianceRepository, times(1)).findByAlertDateBefore(any(LocalDate.class));
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

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
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

    @Test
    void testRecurringAlert_Monthly() {
        // Arrange
        User testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        LocalDate originalAlertDate = LocalDate.of(2024, 1, 15);
        Appliance monthlyAppliance = Appliance.builder()
            .id(1L)
            .name("Monthly Maintenance Appliance")
            .alertDate(originalAlertDate)
            .userId(1L)
            .recurringInterval("MONTHLY")
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(monthlyAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, monthlyAppliance);
        verify(applianceRepository, times(1)).save(argThat(appliance ->
            appliance.getAlertDate().equals(originalAlertDate.plusMonths(1)) &&
            "ACTIVE".equals(appliance.getAlertStatus()) &&
            appliance.getSnoozeUntil() == null
        ));
    }

    @Test
    void testRecurringAlert_Yearly() {
        // Arrange
        User testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        LocalDate originalAlertDate = LocalDate.of(2024, 6, 1);
        Appliance yearlyAppliance = Appliance.builder()
            .id(1L)
            .name("Yearly Maintenance Appliance")
            .alertDate(originalAlertDate)
            .userId(1L)
            .recurringInterval("YEARLY")
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(yearlyAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, yearlyAppliance);
        verify(applianceRepository, times(1)).save(argThat(appliance ->
            appliance.getAlertDate().equals(originalAlertDate.plusYears(1)) &&
            "ACTIVE".equals(appliance.getAlertStatus())
        ));
    }

    @Test
    void testRecurringAlert_Custom() {
        // Arrange
        User testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        LocalDate originalAlertDate = LocalDate.of(2024, 3, 10);
        Appliance customAppliance = Appliance.builder()
            .id(1L)
            .name("Custom Interval Appliance")
            .alertDate(originalAlertDate)
            .userId(1L)
            .recurringInterval("CUSTOM")
            .recurringIntervalDays(90)
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(customAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, customAppliance);
        verify(applianceRepository, times(1)).save(argThat(appliance ->
            appliance.getAlertDate().equals(originalAlertDate.plusDays(90)) &&
            "ACTIVE".equals(appliance.getAlertStatus())
        ));
    }

    @Test
    void testRecurringAlert_None() {
        // Arrange - Test that NONE interval doesn't schedule a new alert
        User testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        LocalDate originalAlertDate = LocalDate.of(2024, 3, 10);
        Appliance noneAppliance = Appliance.builder()
            .id(1L)
            .name("One-time Alert Appliance")
            .alertDate(originalAlertDate)
            .userId(1L)
            .recurringInterval("NONE")
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(noneAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, noneAppliance);
        // Should not save the appliance (no recurring scheduling)
        verify(applianceRepository, never()).save(any());
    }

    @Test
    void testRecurringAlert_NullInterval() {
        // Arrange - Test that null interval doesn't schedule a new alert
        User testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        LocalDate originalAlertDate = LocalDate.of(2024, 3, 10);
        Appliance nullIntervalAppliance = Appliance.builder()
            .id(1L)
            .name("No Interval Appliance")
            .alertDate(originalAlertDate)
            .userId(1L)
            .recurringInterval(null)
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(nullIntervalAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, nullIntervalAppliance);
        // Should not save the appliance (no recurring scheduling)
        verify(applianceRepository, never()).save(any());
    }

    @Test
    void testCheckAndSendAlerts_CancelledAlertNotSent() {
        // Arrange
        Appliance cancelledAppliance = Appliance.builder()
            .id(1L)
            .name("Cancelled Appliance")
            .alertDate(LocalDate.now())
            .userId(1L)
            .alertStatus("CANCELLED")
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(cancelledAppliance));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, never()).sendMaintenanceAlert(any(), any());
        verify(applianceRepository, never()).save(any());
    }

    @Test
    void testCheckAndSendAlerts_SnoozedAlertReactivated() {
        // Arrange - Snooze period has ended
        User testUser = User.builder()
            .id(1L)
            .name("Test User")
            .email("test@example.com")
            .build();

        Appliance snoozedAppliance = Appliance.builder()
            .id(1L)
            .name("Snoozed Appliance")
            .alertDate(LocalDate.now())
            .userId(1L)
            .alertStatus("SNOOZED")
            .snoozeUntil(LocalDate.now().minusDays(1)) // Snooze ended yesterday
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(snoozedAppliance));
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(applianceRepository, times(1)).save(argThat(appliance ->
            "ACTIVE".equals(appliance.getAlertStatus()) &&
            appliance.getSnoozeUntil() == null
        ));
        verify(emailService, times(1)).sendMaintenanceAlert(testUser, snoozedAppliance);
    }

    @Test
    void testCheckAndSendAlerts_SnoozedAlertStillActive() {
        // Arrange - Snooze period still active
        Appliance snoozedAppliance = Appliance.builder()
            .id(1L)
            .name("Snoozed Appliance")
            .alertDate(LocalDate.now())
            .userId(1L)
            .alertStatus("SNOOZED")
            .snoozeUntil(LocalDate.now().plusDays(3)) // Snoozed until 3 days from now
            .build();

        when(applianceRepository.findByAlertDateBefore(any(LocalDate.class)))
            .thenReturn(Arrays.asList(snoozedAppliance));

        // Act
        alertSchedulerService.checkAndSendAlerts();

        // Assert
        verify(emailService, never()).sendMaintenanceAlert(any(), any());
    }
}
