package com.example.demo.controller;

import com.example.demo.model.Appliance;
import com.example.demo.service.ApplianceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ApplianceController.class)
public class ApplianceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplianceService applianceService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllAppliancesByUserId() throws Exception {
        Long userId = 1L;

        //Appliance appliance1 = new Appliance(1L, "Dishwasher", "Bosch 300", null, userId);

        List<Appliance> appliances = Arrays.asList(
                new Appliance(1L, "Dishwasher", "Bosch 300", null, userId),
                new Appliance(2L, "Refrigerator", "Samsung FamilyHub", null, userId)
        );

        Mockito.when(applianceService.getAllAppliancesByUser(userId))
               .thenReturn(appliances);

        mockMvc.perform(get("/api/{userId}/appliances", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Dishwasher")))
                .andExpect(jsonPath("$[1].name", is("Refrigerator")));
    }

    @Test
    void testCreateAppliance() throws Exception {
        Appliance input = new Appliance(null, "Washer", "LG TurboWash", null, 1L);
        Appliance saved = new Appliance(10L, "Washer", "LG TurboWash", null, 1L);

        Mockito.when(applianceService.saveAppliance(any(Appliance.class)))
                .thenReturn(saved);

        mockMvc.perform(post("/api/{userId}/appliances", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(10)))
                .andExpect(jsonPath("$.name", is("Washer")));
    }
}
