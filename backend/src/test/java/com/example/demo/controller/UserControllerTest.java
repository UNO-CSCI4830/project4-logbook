package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void getAllReturnsListOfUsers() throws Exception {
        // Build users with setters instead of all-args constructor
        User alice = new User();
        alice.setId(1L);
        alice.setName("Alice");
        alice.setEmail("alice@example.com");
        alice.setPassword("pass");

        User bob = new User();
        bob.setId(2L);
        bob.setName("Bob");
        bob.setEmail("bob@example.com");
        bob.setPassword("secret");

        when(userService.getAllUsers()).thenReturn(Arrays.asList(alice, bob));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Alice"))
                .andExpect(jsonPath("$[1].name").value("Bob"));
    }

    @Test
    void createUserReturnsSavedUser() throws Exception {
        User charlie = new User();
        charlie.setId(3L);
        charlie.setName("Charlie");
        charlie.setEmail("charlie@example.com");
        charlie.setPassword("pwd");

        when(userService.saveUser(charlie)).thenReturn(charlie);

        mockMvc.perform(post("/api/users")
                .contentType("application/json")
                .content("{\"id\":3,\"name\":\"Charlie\",\"email\":\"charlie@example.com\",\"password\":\"pwd\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Charlie"));
    }
}
