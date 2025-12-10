package com.example.demo.repository;

import java.time.LocalDate;
import java.util.Date;

import com.example.demo.model.Appliance;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ApplianceRepositoryTest {

    @Autowired
    private ApplianceRepository applianceRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("findAllByUserId returns all appliances belonging to a user")
    void testFindAllByUserId() {
        // Given
        Appliance a1 = Appliance.builder()
                .name("Dishwasher")
                .model("Bosch 300")
                .alertDate(LocalDate.now())
                .userId(1L)
                .build();
        Appliance a2 = Appliance.builder()
                .name("Refrigerator")
                .model("LG ThinQ")
                .alertDate(LocalDate.now())
                .userId(1L)
                .build();
        Appliance a3 = Appliance.builder()
                .name("Fridge")
                .model("Samsung")
                .alertDate(LocalDate.now())
                .userId(2L)
                .build(); // different user

        applianceRepository.save(a1);
        applianceRepository.save(a2);
        applianceRepository.save(a3);

        // When
        List<Appliance> results = applianceRepository.findAllByUserId(1L);

        // Then
        assertThat(results).hasSize(2);
        assertThat(results)
                .extracting(Appliance::getName)
                .containsExactlyInAnyOrder("Dishwasher", "Refrigerator");
    }

    @Test
    @DisplayName("findByUserIdAndId returns appliance for matching user and id")
    void testFindByUserIdAndId() {
        // Given
        Appliance a1 = Appliance.builder()
                .name("Washer")
                .model("LG TurboWash")
                .alertDate(LocalDate.now())
                .userId(5L)
                .build();
        a1 = applianceRepository.save(a1);

        // When
        Optional<Appliance> found =
                applianceRepository.findByUserIdAndId(5L, a1.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Washer");
    }

    @Test
    @DisplayName("findByUserIdAndId returns empty when userId does not match")
    void testFindByUserIdAndId_NoMatch() {
        // Given
        Appliance a1 = Appliance.builder()
                .name("Oven")
                .model("GE Profile")
                .alertDate(LocalDate.now())
                .userId(3L)
                .build();
        a1 = applianceRepository.save(a1);

        // When
        Optional<Appliance> found =
                applianceRepository.findByUserIdAndId(9L, a1.getId());

        // Then
        assertThat(found).isNotPresent();
    }
}
