package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.util.List;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {

  private final UserRepository userRepository;

  public UserService(com.example.demo.repository.UserRepository userRepository) {
      this.userRepository = userRepository;
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public User saveUser(User user) {
    return userRepository.save(user);
  }

  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public User updateUser(User user) {
    return userRepository.save(user);
  }
}
