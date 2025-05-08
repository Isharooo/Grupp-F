package com.groupf.Backend.repository;

import com.groupf.Backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderIdAndProductId(Long orderId, Long productId);

    List<OrderItem> findByOrderId(Long orderId);
}
