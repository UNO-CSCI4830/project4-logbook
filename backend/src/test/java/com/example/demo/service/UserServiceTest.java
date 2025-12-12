package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); 
    }

    @Test
    void testGetAllUsers() {
        User user = User.builder()
                .name("JohnDoe")
                .email("johndoe@test.com")
                .password("securepassword")
                .build(); 
        List <User> userList = Arrays.asList(user);
        
        when(userRepository.findAll()).thenReturn(userList);
        
        List<User> result = userService.getAllUsers();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("JohnDoe");   
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testSaveUser() {
        User user = User.builder()
                .name("JohnDoe")
                .email("johndoe@test.com")
                .password("securepassword")
                .build(); 
        
        User savedUser = User.builder()
                .id(1L)
                .name("JohnDoe")
                .email("johndoe@test.com")
                .password("securepassword")
                .build(); 

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        User result = userService.saveUser(user);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo(savedUser.getEmail());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testGetUserByEmail() {
        String email = "johndoe@test.com";
        User user = User.builder()
                .id(1L)
                .name("JohnDoe")
                .email(email)
                .password("securepassword")
                .build();   
        
        when(userRepository.findByEmail(email)).thenReturn(user);
        User result = userService.getUserByEmail(email);
        
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("JohnDoe");
        assertThat(result.getEmail()).isEqualTo(email);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void testUpdateUser() {
        User user = User.builder()
                .id(1L)
                .name("JohnDoe")
                .email("johndoe@test.com")
                .password("securepassword")
                .build();
        when(userRepository.save(any(User.class))).thenReturn(user);    
        User result = userService.updateUser(user);
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("JohnDoe");
        verify(userRepository, times(1)).save(user);    
    }
}
