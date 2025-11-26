package com.example.demo.model;

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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // important for SQLite
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable=true)
    private String description;

    @Column(nullable=true)
    private String brand;

    @Column(nullable=true)
    private String model;

    @Column(nullable=true)
    private String serialNumber;

    @Column(nullable=true)
    private String notes;

    @Column(nullable=true)
    private Date purchaseDate;

    @Column(nullable=true)
    private Date warrantyEndDate;

    @Column(nullable=true)
    private Integer warrantyMonths;

    @Column(nullable = false)
    private Long userId;
    
}
