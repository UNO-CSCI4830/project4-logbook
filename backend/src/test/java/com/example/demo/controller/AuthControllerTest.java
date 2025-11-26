package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserCredentials;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @Test
    void loginWithValidCredentialsReturns200() throws Exception {
        User user = new User(1L, "Alice", "alice@example.com", "pass");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(user);

        mockMvc.perform(post("/login")
                .contentType("application/json")
                .content("{\"email\":\"alice@example.com\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Login successful"));
    }

    @Test
    void loginWithInvalidCredentialsReturns401() throws Exception {
        when(userRepository.findByEmail("bob@example.com")).thenReturn(null);

        mockMvc.perform(post("/login")
                .contentType("application/json")
                .content("{\"email\":\"bob@example.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }
}
