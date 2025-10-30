package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public User saveUser(User user) {
    return userRepository.save(user);
  }
}
