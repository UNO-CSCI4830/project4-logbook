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
            // Skip if alert is cancelled
            if ("CANCELLED".equals(appliance.getAlertStatus())) {
                log.info("Skipping cancelled alert for appliance {}", appliance.getName());
                continue;
            }

            // Skip if alert is snoozed and snooze period hasn't ended
            if ("SNOOZED".equals(appliance.getAlertStatus()) && appliance.getSnoozeUntil() != null) {
                if (LocalDate.now().isBefore(appliance.getSnoozeUntil())) {
                    log.info("Skipping snoozed alert for appliance {} (snoozed until {})",
                            appliance.getName(), appliance.getSnoozeUntil());
                    continue;
                } else {
                    // Snooze period ended, reactivate alert
                    appliance.setAlertStatus("ACTIVE");
                    appliance.setSnoozeUntil(null);
                    applianceRepository.save(appliance);
                    log.info("Reactivated alert for appliance {} (snooze period ended)", appliance.getName());
                }
            }

            userRepository.findById(appliance.getUserId()).ifPresentOrElse(
                user -> {
                    emailService.sendMaintenanceAlert(user, appliance);
                    log.info("Sent alert for appliance {} to user {}", appliance.getName(), user.getEmail());

                    // Handle recurring alerts
                    handleRecurringAlert(appliance);
                },
                () -> log.warn("User not found for appliance {} (userId: {})", appliance.getName(), appliance.getUserId())
            );
        }

        log.info("Completed scheduled alert check");
    }

    private void handleRecurringAlert(Appliance appliance) {
        String interval = appliance.getRecurringInterval();

        // Skip if not recurring or interval is NONE
        if (interval == null || "NONE".equals(interval)) {
            return;
        }

        LocalDate currentAlertDate = appliance.getAlertDate();
        LocalDate nextAlertDate = null;

        switch (interval) {
            case "MONTHLY":
                nextAlertDate = currentAlertDate.plusMonths(1);
                break;
            case "YEARLY":
                nextAlertDate = currentAlertDate.plusYears(1);
                break;
            case "CUSTOM":
                Integer days = appliance.getRecurringIntervalDays();
                if (days != null && days > 0) {
                    nextAlertDate = currentAlertDate.plusDays(days);
                }
                break;
        }

        if (nextAlertDate != null) {
            appliance.setAlertDate(nextAlertDate);
            appliance.setAlertStatus("ACTIVE");
            appliance.setSnoozeUntil(null);
            applianceRepository.save(appliance);
            log.info("Scheduled next recurring alert for appliance {} on {}",
                    appliance.getName(), nextAlertDate);
        }
    }
}
