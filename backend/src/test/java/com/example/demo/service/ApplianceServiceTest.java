package com.example.demo.service;

import com.example.demo.model.Appliance;
import com.example.demo.repository.ApplianceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ApplianceServiceTest {

    @Mock
    private ApplianceRepository applianceRepository;

    @InjectMocks
    private ApplianceService applianceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllAppliancesByUser() {
        Long userId = 1L;

        Appliance a1 = new Appliance(1L, "Dishwasher", "Bosch 300", LocalDate.now(), userId);
        Appliance a2 = new Appliance(2L, "Refrigerator", "LG ThinQ", null, userId);
        List<Appliance> mockList = Arrays.asList(a1, a2);

        when(applianceRepository.findAllByUserId(userId)).thenReturn(mockList);

        List<Appliance> result = applianceService.getAllAppliancesByUser(userId);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Dishwasher");

        verify(applianceRepository, times(1)).findAllByUserId(userId);
    }

    @Test
    void testSaveAppliance() {
        Appliance appliance = new Appliance(null, "Washer", "Samsung", LocalDate.now(), 1L);
        Appliance savedAppliance = new Appliance(10L, "Washer", "Samsung", LocalDate.now(), 1L);

        when(applianceRepository.save(any(Appliance.class))).thenReturn(savedAppliance);

        Appliance result = applianceService.saveAppliance(appliance);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Washer");

        verify(applianceRepository, times(1)).save(appliance);
    }
}
