package com.example.demo.service;

import java.util.Date;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.model.Appliance;
import com.example.demo.repository.ApplianceRepository;
import com.example.demo.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AlertSchedulerService {

    private final ApplianceRepository applianceRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AlertSchedulerService(ApplianceRepository applianceRepository,
                                 UserRepository userRepository,
                                 EmailService emailService) {
        this.applianceRepository = applianceRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 9 * * *")
    public void checkAndSendAlerts() {
        log.info("Running scheduled alert check");
        Date today = new Date();
        List<Appliance> alertsDue = applianceRepository.findByAlertDate(today);

        log.info("Found {} appliances with alerts due today", alertsDue.size());

        for (Appliance appliance : alertsDue) {
            userRepository.findById(appliance.getUserId()).ifPresentOrElse(
                user -> {
                    emailService.sendMaintenanceAlert(user, appliance);
                    log.info("Sent alert for appliance {} to user {}", appliance.getName(), user.getEmail());
                },
                () -> log.warn("User not found for appliance {} (userId: {})", appliance.getName(), appliance.getUserId())
            );
        }

        log.info("Completed scheduled alert check");
    }
}
