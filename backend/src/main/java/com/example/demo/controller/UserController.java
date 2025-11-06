package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.model.User;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

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
