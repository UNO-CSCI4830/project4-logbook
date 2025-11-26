package com.example.demo.model;

import java.time.LocalDate;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name ="appliances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appliance {

    public Appliance(long par, String oven, String ge_Profile, LocalDate now, long par1) {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // important for SQLite
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable=true)
    private String description;

    @Column(nullable=true)
    private LocalDate alertDate;

    @Column(nullable = false)
    private Long userId;
    
}
