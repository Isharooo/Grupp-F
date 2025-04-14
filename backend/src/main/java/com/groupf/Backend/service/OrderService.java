package com.groupf.Backend.service;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /*public Order createOrder(Order order) {
        return orderRepository.save(order);
    }*/

    public Order createOrder(Order order) {
        order.setCreationDate(LocalDate.now()); // Sätts automatiskt i databasen
        return orderRepository.save(order);
    }

    /*public Order updateOrder(Long id, Order order) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        existingOrder.setCustomerName(order.getCustomerName());
        existingOrder.setSendDate(order.getSendDate());
        return orderRepository.save(existingOrder);
    }*/

    public Order updateOrder(Long id, String customerName, LocalDate sendDate) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        if (customerName != null
                && !customerName.isEmpty()
                && !Objects.equals(order.getCustomerName(), customerName)) {
            order.setCustomerName(customerName);
        }
        if (sendDate != null
                && sendDate.isAfter(LocalDate.now())
                && !Objects.equals(order.getSendDate(), sendDate)) {
            order.setSendDate(sendDate);
        }
        return orderRepository.save(order);
    }

    public Order changeCompleteStatus(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setCompleted(!order.isCompleted());
        return orderRepository.save(order);
    }

    /*public ResponseEntity<Order> updateOrder(Long id, Order order) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        existingOrder.setCustomerName(order.getCustomerName());
        existingOrder.setSendDate(order.getSendDate());
        orderRepository.save(existingOrder);
        return ResponseEntity.ok(existingOrder);
    }*/

        public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}