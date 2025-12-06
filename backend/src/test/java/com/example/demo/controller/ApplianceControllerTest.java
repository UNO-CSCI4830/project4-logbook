package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.example.demo.DemoApplication;
import com.example.demo.model.Appliance;
import com.example.demo.repository.ApplianceRepository;
import com.example.demo.service.AlertSchedulerService;
import com.example.demo.service.ApplianceService;

@WebMvcTest(ApplianceController.class)
@ContextConfiguration(classes = DemoApplication.class)
class ApplianceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplianceService applianceService;

    @MockBean
    private ApplianceRepository applianceRepository;

    @MockBean
    private AlertSchedulerService alertSchedulerService;

    @Test
    void testTriggerAlerts_Success() throws Exception {
        // Arrange - alertSchedulerService.checkAndSendAlerts() is mocked, returns void

        // Act & Assert
        mockMvc.perform(post("/api/1/appliances/trigger-alerts"))
            .andExpect(status().isOk())
            .andExpect(content().string("Alert check triggered manually. Check logs for results."));

        // Verify the service method was called
        verify(alertSchedulerService, times(1)).checkAndSendAlerts();
    }

    @Test
    void testTriggerAlerts_ServiceCalled() throws Exception {
        // Arrange
        doNothing().when(alertSchedulerService).checkAndSendAlerts();

        // Act
        mockMvc.perform(post("/api/1/appliances/trigger-alerts"));

        // Assert - verify the scheduler service was invoked
        verify(alertSchedulerService, times(1)).checkAndSendAlerts();
        verifyNoMoreInteractions(alertSchedulerService);
    }

    @Test
    void testSnoozeAlert_Success() throws Exception {
        // Arrange
        Long userId = 1L;
        Long applianceId = 1L;
        int snoozeDays = 7;

        Appliance appliance = Appliance.builder()
            .id(applianceId)
            .name("Test Appliance")
            .userId(userId)
            .alertStatus("ACTIVE")
            .build();

        Appliance snoozedAppliance = Appliance.builder()
            .id(applianceId)
            .name("Test Appliance")
            .userId(userId)
            .alertStatus("SNOOZED")
            .snoozeUntil(LocalDate.now().plusDays(snoozeDays))
            .build();

        when(applianceRepository.findByUserIdAndId(userId, applianceId))
            .thenReturn(Optional.of(appliance));
        when(applianceRepository.save(any(Appliance.class)))
            .thenReturn(snoozedAppliance);

        // Act & Assert
        mockMvc.perform(post("/api/{userId}/appliances/{applianceId}/alert/snooze", userId, applianceId)
                .param("days", String.valueOf(snoozeDays)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.alertStatus").value("SNOOZED"))
            .andExpect(jsonPath("$.snoozeUntil").exists());

        verify(applianceRepository, times(1)).save(any(Appliance.class));
    }

    @Test
    void testSnoozeAlert_ApplianceNotFound() throws Exception {
        // Arrange
        Long userId = 1L;
        Long applianceId = 999L;

        when(applianceRepository.findByUserIdAndId(userId, applianceId))
            .thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(post("/api/{userId}/appliances/{applianceId}/alert/snooze", userId, applianceId)
                .param("days", "7"))
            .andExpect(status().isNotFound());

        verify(applianceRepository, never()).save(any(Appliance.class));
    }

    @Test
    void testCancelAlert_Success() throws Exception {
        // Arrange
        Long userId = 1L;
        Long applianceId = 1L;

        Appliance appliance = Appliance.builder()
            .id(applianceId)
            .name("Test Appliance")
            .userId(userId)
            .alertStatus("ACTIVE")
            .build();

        Appliance cancelledAppliance = Appliance.builder()
            .id(applianceId)
            .name("Test Appliance")
            .userId(userId)
            .alertStatus("CANCELLED")
            .snoozeUntil(null)
            .build();

        when(applianceRepository.findByUserIdAndId(userId, applianceId))
            .thenReturn(Optional.of(appliance));
        when(applianceRepository.save(any(Appliance.class)))
            .thenReturn(cancelledAppliance);

        // Act & Assert
        mockMvc.perform(post("/api/{userId}/appliances/{applianceId}/alert/cancel", userId, applianceId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.alertStatus").value("CANCELLED"));

        verify(applianceRepository, times(1)).save(any(Appliance.class));
    }

    @Test
    void testCancelAlert_ApplianceNotFound() throws Exception {
        // Arrange
        Long userId = 1L;
        Long applianceId = 999L;

        when(applianceRepository.findByUserIdAndId(userId, applianceId))
            .thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(post("/api/{userId}/appliances/{applianceId}/alert/cancel", userId, applianceId))
            .andExpect(status().isNotFound());

        verify(applianceRepository, never()).save(any(Appliance.class));
    }

    @Test
    void testReactivateAlert_Success() throws Exception {
        // Arrange
        Long userId = 1L;
        Long applianceId = 1L;

        Appliance appliance = Appliance.builder()
            .id(applianceId)
            .name("Test Appliance")
            .userId(userId)
            .alertStatus("CANCELLED")
            .build();

        Appliance reactivatedAppliance = Appliance.builder()
            .id(applianceId)
            .name("Test Appliance")
            .userId(userId)
            .alertStatus("ACTIVE")
            .snoozeUntil(null)
            .build();

        when(applianceRepository.findByUserIdAndId(userId, applianceId))
            .thenReturn(Optional.of(appliance));
        when(applianceRepository.save(any(Appliance.class)))
            .thenReturn(reactivatedAppliance);

        // Act & Assert
        mockMvc.perform(post("/api/{userId}/appliances/{applianceId}/alert/reactivate", userId, applianceId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.alertStatus").value("ACTIVE"));

        verify(applianceRepository, times(1)).save(any(Appliance.class));
    }

    @Test
    void testReactivateAlert_ApplianceNotFound() throws Exception {
        // Arrange
        Long userId = 1L;
        Long applianceId = 999L;

        when(applianceRepository.findByUserIdAndId(userId, applianceId))
            .thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(post("/api/{userId}/appliances/{applianceId}/alert/reactivate", userId, applianceId))
            .andExpect(status().isNotFound());

        verify(applianceRepository, never()).save(any(Appliance.class));
    }
}
