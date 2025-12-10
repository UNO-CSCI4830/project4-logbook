package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF disabled (for APIs; enable if you use forms)
            .csrf(csrf -> csrf.disable())

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()   // login/signup open
                .requestMatchers("/api/users/**").permitAll() // allow - JWT auth handled in controller
                .anyRequest().permitAll()
            )

            // HTTP Basic (if you want it) — new style
            .httpBasic(httpBasic -> {}) 

            // Or JWT filter instead of httpBasic
            .formLogin(form -> form.disable()); // disable default login form

        return http.build();
    }
}