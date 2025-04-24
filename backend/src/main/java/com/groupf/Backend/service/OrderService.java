package com.groupf.Backend.service;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.repository.OrderRepository;
import jakarta.transaction.Transactional;
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

    @Transactional
    public List<Order> getActiveOrders() {
        return orderRepository.findAllActiveOrders()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public List<Order> getCompletedOrders() {
        return orderRepository.findAllCompletedOrders()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public Order createOrder(Order order) {
        order.setCreationDate(LocalDate.now()); // Sätts automatiskt i databasen
        return orderRepository.save(order);
    }

    public Order changeOrderStatus(Long id, boolean markAsSent) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (markAsSent) {
            if (order.getSendDate()==null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            order.setCompleted(true);
            order.setSendDate(LocalDate.now());
        }
        else {
            order.setCompleted(false);
        }
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, String customerName, LocalDate plannedSendDate) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (customerName != null && !customerName.isEmpty()) {
            order.setCustomerName(customerName);
        }

        if (plannedSendDate != null) {
            order.setSendDate(plannedSendDate);
        }

        return orderRepository.save(order);
    }

    public Order changeCompleteStatus(Long id) {
        //kontrollera att den kan bara användas om namn och senddatum finns!
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setCompleted(!order.isCompleted());
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}