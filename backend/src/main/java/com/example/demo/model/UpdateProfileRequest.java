package com.example.demo.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    private String name;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthday;
    private String profilePictureUrl;
}
