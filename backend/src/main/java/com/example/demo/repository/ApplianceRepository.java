package com.example.demo.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Appliance;

public interface ApplianceRepository extends JpaRepository<Appliance, Long> {
    List<Appliance> findAllByUserId(Long userId);

    Optional<Appliance> findByUserIdAndId(Long userId, Long applianceId);

    @Query("SELECT a FROM Appliance a WHERE DATE(a.alertDate) = DATE(:date)")
    List<Appliance> findByAlertDate(@Param("date") Date date);
}
