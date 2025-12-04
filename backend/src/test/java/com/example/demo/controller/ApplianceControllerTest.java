package com.example.demo.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.example.demo.DemoApplication;
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
}
