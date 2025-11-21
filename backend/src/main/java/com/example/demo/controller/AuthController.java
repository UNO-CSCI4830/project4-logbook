package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.model.UserCredentials;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthController {
    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserCredentials creds) {
        User user = userRepository.findByEmail(creds.getEmail());
        if (user != null && user.getPassword().equals(creds.getPassword())) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

     @PostMapping("/forgot")
    public ResponseEntity<String> forgotPassword(@RequestBody UserCredentials creds) {
        User user = userRepository.findByEmail(creds.getEmail());
        if (user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No email was found");
        } 
        user.setPassword(creds.getPassword());
        userRepository.save(user);

        return ResponseEntity.ok("Password updated.");

    }

}
