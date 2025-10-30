package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
public class UserController {
  private final UserService userService;

  @GetMapping
  public List<User> getAll() {
    return userService.getAllUsers();
      
  }

  @PostMapping
  public User create(@RequestBody User user) {
    System.out.println(user);
    return userService.saveUser(user);
  }
}
