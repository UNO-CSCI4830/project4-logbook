package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Check if dev user already exists
        if (userRepository.findByEmail("dev@test.com") == null) {
            // Create a dev user for testing
            User devUser = User.builder()
                    .name("Dev User")
                    .email("dev@test.com")
                    .password("dev123")
                    .build();

            userRepository.save(devUser);
            System.out.println("===========================================");
            System.out.println("DEV USER CREATED:");
            System.out.println("Email: dev@test.com");
            System.out.println("Password: dev123");
            System.out.println("===========================================");
        }
    }
}
