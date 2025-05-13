package com.groupf.Backend.repository;

import com.groupf.Backend.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class ProductRepositoryTest {

    @Autowired
    private ProductRepository repo;

    private Product pVisibleA, pInvisible, pVisibleB;

    @BeforeEach
    void setUp() {
        pVisibleA   = new Product();
        pVisibleA.setName("Foo");   pVisibleA.setVisible(true);

        pInvisible  = new Product();
        pInvisible.setName("Bar");  pInvisible.setVisible(false);

        pVisibleB   = new Product();
        pVisibleB.setName("Baz");   pVisibleB.setVisible(true);

        repo.saveAll(List.of(pVisibleA, pInvisible, pVisibleB));
    }

    @Test
    void findAllVisibleProducts_onlyReturnsVisible() {
        List<Product> list = repo.findAllVisibleProducts();
        assertThat(list)
                .containsExactlyInAnyOrder(pVisibleA, pVisibleB)
                .allMatch(Product::isVisible);
    }

    @Test
    void findProductById_returnsCorrectOptional() {
        Optional<Product> opt = repo.findProductById(pVisibleA.getId());
        assertThat(opt).contains(pVisibleA);
    }
}
