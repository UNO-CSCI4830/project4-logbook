package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.model.Appliance;
import com.example.demo.repository.ApplianceRepository;
import com.example.demo.repository.UserRepository;

@Service
public class AlertSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(AlertSchedulerService.class);

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
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Appliance> alertsDue = applianceRepository.findByAlertDateBefore(tomorrow);

        log.info("Found {} appliances with alerts due today or earlier", alertsDue.size());

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
