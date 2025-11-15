package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Appliance;

public interface ApplianceRepository extends JpaRepository<Appliance, Long> {
    List<Appliance> findAllByUserId(Long userId);
    
    Optional<Appliance> findByUserIdAndId(Long userId, Long applianceId);
}
