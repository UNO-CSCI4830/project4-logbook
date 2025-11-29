package com.example.demo.service;

import com.example.demo.model.Appliance;
import com.example.demo.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendMaintenanceAlert(User user, Appliance appliance) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Maintenance Alert: " + appliance.getName());
            message.setText(buildAlertMessage(user, appliance));

            mailSender.send(message);
            log.info("Sent maintenance alert email to {} for appliance {}", user.getEmail(), appliance.getName());
        } catch (Exception e) {
            log.error("Failed to send maintenance alert email to {} for appliance {}: {}",
                user.getEmail(), appliance.getName(), e.getMessage());
        }
    }

    private String buildAlertMessage(User user, Appliance appliance) {
        StringBuilder message = new StringBuilder();
        message.append("Hello ").append(user.getName()).append(",\n\n");
        message.append("This is a reminder that your appliance requires attention:\n\n");
        message.append("Appliance: ").append(appliance.getName()).append("\n");

        if (appliance.getDescription() != null && !appliance.getDescription().isEmpty()) {
            message.append("Description: ").append(appliance.getDescription()).append("\n");
        }

        message.append("\nPlease schedule the necessary maintenance or updates.\n\n");
        message.append("Best regards,\n");
        message.append("Appliance Logbook System");

        return message.toString();
    }
}
