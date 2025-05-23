package com.groupf.Backend.controller;

import com.groupf.Backend.model.Order;
import com.groupf.Backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @GetMapping("/all")
    @PreAuthorize("hasRole('admin')")
    public List<Order> getAllOrders(Authentication authentication) {
        System.out.println("Authorities: " + authentication.getAuthorities());
        return orderService.getAllOrders();
    }

    @GetMapping("/order/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(Principal principal) {
        return orderService.getOrdersByUserId(principal.getName());
    }


    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order, Principal principal) {
        return new ResponseEntity<>(orderService.createOrder(order, principal.getName()), HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        return ResponseEntity.ok(orderService.updateOrder(id, order.getCustomerName(), order.getSendDate()));
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

    @GetMapping("/order/{id}/pdf")
    public ResponseEntity<byte[]> downloadOrderPdf(@PathVariable Long id) {
        byte[] pdf = orderService.generateOrderPdf(id);
        Order order = orderService.getOrderById(id);
        String customer = sanitize(order.getCustomerName());
        String today    = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        String fileName = String.format("order_%s_%s.pdf", customer, today);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(fileName)
                        .build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    private String sanitize(String raw) {
        return Normalizer.normalize(raw, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .replaceAll("[^A-Za-z0-9]+", "_")
                .replaceAll("^_|_$", "")
                .toLowerCase();
    }
}
