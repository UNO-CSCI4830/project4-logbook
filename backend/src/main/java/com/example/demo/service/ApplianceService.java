package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Appliance;
import com.example.demo.repository.ApplianceRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ApplianceService {

    public final ApplianceRepository applianceRepository;
    
    public ApplianceService(ApplianceRepository applianceRepository) {
        this.applianceRepository = applianceRepository;
    }

    public List<Appliance> getAllAppliancesByUser(Long userId) {
        return applianceRepository.findAllByUserId(userId);
    }

    public Appliance saveAppliance(Appliance appliance) {
        return applianceRepository.save(appliance);
    }
}
