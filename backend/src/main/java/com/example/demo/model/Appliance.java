package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name ="appliances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable=true)
    private String description;

    @Column(nullable=true)
    private String category;

    @Column(nullable=true)
    private String brand;

    @Column(nullable=true)
    private String model;

    @Column(nullable=true)
    private String serialNumber;

    @Column(nullable=true)
    private String purchaseDate;

    @Column(nullable=true)
    private Integer warrantyMonths;

    @Column(nullable=true)
    private String conditionText;

    @Column(nullable=true)
    private String notes;

    @Column(nullable=true)
    private LocalDate alertDate;

    @Column(nullable = false)
    private Long userId;
}
