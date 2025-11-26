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
        Appliance a1 = new Appliance(1L, "Dishwasher", "Bosch 300", LocalDate.now(), 1L);
        Appliance a2 = new Appliance(2L, "Refrigerator", "LG ThinQ", LocalDate.now(), 1L);
        Appliance a3 = new Appliance(3L, "Fridge", "Samsung", LocalDate.now(), 2L); // different user

        entityManager.persist(a1);
        entityManager.persist(a2);
        entityManager.persist(a3);
        entityManager.flush();

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
        Appliance a1 = new Appliance(1L, "Washer", "LG TurboWash", LocalDate.now(), 5L);
        entityManager.persist(a1);
        entityManager.flush();

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
        Appliance a1 = new Appliance(1L, "Oven", "GE Profile", LocalDate.now(), 3L);
        entityManager.persist(a1);
        entityManager.flush();

        // When
        Optional<Appliance> found =
                applianceRepository.findByUserIdAndId(9L, a1.getId());

        // Then
        assertThat(found).isNotPresent();
    }
}
