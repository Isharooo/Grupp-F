package com.groupf.Backend.repository;

import com.groupf.Backend.model.Order;
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
class OrderRepositoryTest {

    @Autowired
    private OrderRepository repo;

    private Order active1, active2, completed;

    @BeforeEach
    void setUp() {
        active1   = new Order(); active1.setCompleted(false);
        active2   = new Order(); active2.setCompleted(false);
        completed = new Order(); completed.setCompleted(true);

        repo.saveAll(List.of(active1, completed, active2));
    }

    @Test
    void findAllActiveOrders_returnsOnlyNotCompleted() {
        Optional<List<Order>> opt = repo.findAllActiveOrders();
        assertThat(opt).isPresent();
        List<Order> active = opt.get();
        assertThat(active)
                .hasSize(2)
                .allMatch(o -> !o.isCompleted());
    }

    @Test
    void findAllCompletedOrders_returnsOnlyCompleted() {
        Optional<List<Order>> opt = repo.findAllCompletedOrders();
        assertThat(opt).isPresent();
        List<Order> done = opt.get();
        assertThat(done)
                .hasSize(1)
                .allMatch(Order::isCompleted);
    }
}
