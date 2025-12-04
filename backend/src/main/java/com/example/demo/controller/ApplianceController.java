package com.example.demo.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Appliance;
import com.example.demo.repository.ApplianceRepository;
import com.example.demo.service.ApplianceService;
import com.example.demo.service.AlertSchedulerService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/{userId}/appliances")
public class ApplianceController {
    private final ApplianceService applianceService;
    private final ApplianceRepository applianceRepository;
    private final AlertSchedulerService alertSchedulerService;

    public ApplianceController(ApplianceService applianceService, ApplianceRepository applianceRepository, AlertSchedulerService alertSchedulerService) {
        this.applianceService = applianceService;
        this.applianceRepository = applianceRepository;
        this.alertSchedulerService = alertSchedulerService;
    }

    @GetMapping
    public List<Appliance> getAllAppliancesByUserId(@PathVariable("userId") Long userId) {
        return applianceService.getAllAppliancesByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appliance> getApplianceById(
            @PathVariable("userId") Long userId,
            @PathVariable("id") Long id) {
        Optional<Appliance> appliance = applianceRepository.findByUserIdAndId(userId, id);
        return appliance.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Appliance createAppliance(
            @PathVariable("userId") Long userId,
            @RequestBody Appliance appliance) {
        appliance.setUserId(userId);
        return applianceService.saveAppliance(appliance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appliance> updateAppliance(
            @PathVariable("userId") Long userId,
            @PathVariable("id") Long id,
            @RequestBody Appliance applianceDetails) {
        Optional<Appliance> optionalAppliance = applianceRepository.findByUserIdAndId(userId, id);

        if (optionalAppliance.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Appliance appliance = optionalAppliance.get();
        appliance.setName(applianceDetails.getName());
        appliance.setDescription(applianceDetails.getDescription());
        appliance.setCategory(applianceDetails.getCategory());
        appliance.setBrand(applianceDetails.getBrand());
        appliance.setModel(applianceDetails.getModel());
        appliance.setSerialNumber(applianceDetails.getSerialNumber());
        appliance.setPurchaseDate(applianceDetails.getPurchaseDate());
        appliance.setWarrantyMonths(applianceDetails.getWarrantyMonths());
        appliance.setConditionText(applianceDetails.getConditionText());
        appliance.setNotes(applianceDetails.getNotes());
        appliance.setAlertDate(applianceDetails.getAlertDate());

        Appliance updated = applianceService.saveAppliance(appliance);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Appliance> patchAppliance(
            @PathVariable("userId") Long userId,
            @PathVariable("id") Long id,
            @RequestBody Appliance applianceDetails) {
        Optional<Appliance> optionalAppliance = applianceRepository.findByUserIdAndId(userId, id);

        if (optionalAppliance.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Appliance appliance = optionalAppliance.get();

        if (applianceDetails.getName() != null) {
            appliance.setName(applianceDetails.getName());
        }
        if (applianceDetails.getDescription() != null) {
            appliance.setDescription(applianceDetails.getDescription());
        }
        if (applianceDetails.getCategory() != null) {
            appliance.setCategory(applianceDetails.getCategory());
        }
        if (applianceDetails.getBrand() != null) {
            appliance.setBrand(applianceDetails.getBrand());
        }
        if (applianceDetails.getModel() != null) {
            appliance.setModel(applianceDetails.getModel());
        }
        if (applianceDetails.getSerialNumber() != null) {
            appliance.setSerialNumber(applianceDetails.getSerialNumber());
        }
        if (applianceDetails.getPurchaseDate() != null) {
            appliance.setPurchaseDate(applianceDetails.getPurchaseDate());
        }
        if (applianceDetails.getWarrantyMonths() != null) {
            appliance.setWarrantyMonths(applianceDetails.getWarrantyMonths());
        }
        if (applianceDetails.getConditionText() != null) {
            appliance.setConditionText(applianceDetails.getConditionText());
        }
        if (applianceDetails.getNotes() != null) {
            appliance.setNotes(applianceDetails.getNotes());
        }
        if (applianceDetails.getAlertDate() != null) {
            appliance.setAlertDate(applianceDetails.getAlertDate());
        }

        Appliance updated = applianceService.saveAppliance(appliance);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppliance(
            @PathVariable("userId") Long userId,
            @PathVariable("id") Long id) {
        Optional<Appliance> appliance = applianceRepository.findByUserIdAndId(userId, id);

        if (appliance.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        applianceRepository.delete(appliance.get());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Appliance>> getUpcomingAlerts(
            @PathVariable("userId") Long userId) {
        List<Appliance> allAppliances = applianceRepository.findAllByUserId(userId);

        // Get current date
        LocalDate today = LocalDate.now();

        // Filter appliances with alerts due today or in the past
        List<Appliance> alertAppliances = allAppliances.stream()
            .filter(a -> a.getAlertDate() != null && !a.getAlertDate().isAfter(today))
            .collect(Collectors.toList());

        return ResponseEntity.ok(alertAppliances);
    }

    @PostMapping("/trigger-alerts")
    public ResponseEntity<String> triggerAlerts() {
        alertSchedulerService.checkAndSendAlerts();
        return ResponseEntity.ok("Alert check triggered manually. Check logs for results.");
    }
}
