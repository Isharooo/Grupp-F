package com.groupf.Backend.service;

import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class responsible for handling operations related to OrderItem entities.
 * Provides functionality to create, retrieve and delete order items.
 */
@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    /**
     * Constructor that initializes the OrderItemService with the provided repository.
     *
     * @param orderItemRepository the repository used to interact with the database
     */
    @Autowired
    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * Returns a list of all order items in the system.
     *
     * @return list of all OrderItem objects
     */
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    /**
     * Adds a new order item to the database.
     *
     * @param orderItem the order item to be added
     * @return the saved OrderItem object
     */
    public OrderItem addOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    /**
     * Deletes an order item by its ID.
     *
     * @param id the ID of the order item to delete
     */
    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }

    /**
     * Retrieves all order items belonging to a specific order.
     *
     * @param orderId the ID of the order
     * @return list of OrderItem objects
     */
    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    /**
     * Retrieves order items by both order ID and product ID.
     *
     * @param orderId   the ID of the order
     * @param productId the ID of the product
     * @return list of OrderItem objects matching the criteria
     */
    public List<OrderItem> getOrderItemsByOrderIdAndProductId(Long orderId, Long productId) {
        return orderItemRepository.findByOrderIdAndProductId(orderId, productId);
    }

}
