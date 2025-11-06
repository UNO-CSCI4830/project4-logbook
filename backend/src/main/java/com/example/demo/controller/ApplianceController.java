package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Appliance;
import com.example.demo.service.ApplianceService;

@RestController
@RequestMapping("/api/{userId}/appliances")
public class ApplianceController {
    private final ApplianceService applianceService;

    public ApplianceController(ApplianceService applianceService) {
        this.applianceService = applianceService;
    }

    @GetMapping
    public List<Appliance> getAllAppliancesByUserId(@PathVariable("userId") Long userId) {
        return applianceService.getAllAppliancesByUser(userId);
    }

    @PostMapping
    public Appliance createAppliance(@RequestBody Appliance appliance) {
        return applianceService.saveAppliance(appliance);
    }

    //TODO:PutMapping
}
