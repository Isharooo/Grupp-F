package com.groupf.Backend.controller;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// OrderController.java
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    /*@PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        order.setCreationDate(LocalDate.now()); // Sätt automatiskt datum
        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }*/

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return new ResponseEntity<>(orderService.createOrder(order), HttpStatus.CREATED);
    }

    /*@PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Order updatedOrder = orderService.updateOrder(id, order);
        return ResponseEntity.ok(updatedOrder);
    }*/

    @PutMapping("/{id}")
    public ResponseEntity<Order> changeCompleteStatus(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.changeCompleteStatus(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id,
                            @RequestParam(required = false) String customerName,
                            @RequestParam(required = false) LocalDate sendDate) {
        return ResponseEntity.ok(orderService.updateOrder(id,customerName,sendDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
