package com.example.demo;

import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import com.example.demo.service.AlertSchedulerService;

/**
 * Manual test to trigger alert checking without waiting for scheduled time.
 * Run this class directly to test the alert system.
 *
 * Usage:
 * 1. Make sure you have configured email credentials in application.properties
 * 2. Add some test data to the database with alertDate set to today
 * 3. Run this class as a Java application
 */
@SpringBootApplication
public class ManualAlertTest {

    public static void main(String[] args) {
        // Start Spring Boot context
        ConfigurableApplicationContext context = SpringApplication.run(ManualAlertTest.class, args);

        // Get the scheduler service
        AlertSchedulerService scheduler = context.getBean(AlertSchedulerService.class);

        System.out.println("==========================================");
        System.out.println("Manual Alert Test - Starting at: " + new Date());
        System.out.println("==========================================");

        // Manually trigger the scheduled method
        scheduler.checkAndSendAlerts();

        System.out.println("==========================================");
        System.out.println("Alert check completed!");
        System.out.println("Check the logs above for email sending status");
        System.out.println("==========================================");

        // Close the context
        context.close();
    }
}
