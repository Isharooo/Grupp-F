package com.groupf.Backend.repository;

import com.groupf.Backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.completed = false ORDER BY o.id DESC")
    Optional<List<Order>> findAllActiveOrders();

    @Query("SELECT o FROM Order o WHERE o.completed = true ORDER BY o.id DESC")
    Optional<List<Order>> findAllCompletedOrders();
}
