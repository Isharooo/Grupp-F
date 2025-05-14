package com.groupf.Backend.controller;

import com.groupf.Backend.dto.OrderUpdateDTO;
import com.groupf.Backend.model.Order;
import com.groupf.Backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    @PreAuthorize("hasRole('admin')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    //kanske raderas
    @GetMapping("/active")
    public List<Order> getActiveOrders() {
        return orderService.getActiveOrders();
    }

    //kanske raderas
    @GetMapping("/completed")
    public List<Order> getCompletedOrders() {
        return orderService.getCompletedOrders();
    }

    @GetMapping("/order/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return new ResponseEntity<>(orderService.createOrder(order), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody OrderUpdateDTO orderUpdateDTO) {
        return ResponseEntity.ok(orderService.updateOrder(id, orderUpdateDTO.getCustomerName(), orderUpdateDTO.getSendDate()));
    }

    @PutMapping("/change_status/{id}")
    public ResponseEntity<Order> changeCompleteStatus(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.changeCompleteStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam boolean markAsSent) {
        return ResponseEntity.ok(orderService.changeOrderStatus(id, markAsSent));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadOrderPdf(@PathVariable Long id) {
        byte[] pdf = orderService.generateOrderPdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "order_" + id + ".pdf");
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

}
