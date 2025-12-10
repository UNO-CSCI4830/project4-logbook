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

        Appliance a1 = Appliance.builder()
                .id(1L)
                .name("Dishwasher")
                .model("Bosch 300")
                .alertDate(LocalDate.now())
                .userId(userId)
                .build();
        Appliance a2 = Appliance.builder()
                .id(2L)
                .name("Refrigerator")
                .model("LG ThinQ")
                .userId(userId)
                .build();
        List<Appliance> mockList = Arrays.asList(a1, a2);

        when(applianceRepository.findAllByUserId(userId)).thenReturn(mockList);

        List<Appliance> result = applianceService.getAllAppliancesByUser(userId);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Dishwasher");

        verify(applianceRepository, times(1)).findAllByUserId(userId);
    }

    @Test
    void testSaveAppliance() {
        Appliance appliance = Appliance.builder()
                .name("Washer")
                .model("Samsung")
                .alertDate(LocalDate.now())
                .userId(1L)
                .build();
        Appliance savedAppliance = Appliance.builder()
                .id(10L)
                .name("Washer")
                .model("Samsung")
                .alertDate(LocalDate.now())
                .userId(1L)
                .build();

        when(applianceRepository.save(any(Appliance.class))).thenReturn(savedAppliance);

        Appliance result = applianceService.saveAppliance(appliance);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Washer");

        verify(applianceRepository, times(1)).save(appliance);
    }
}
