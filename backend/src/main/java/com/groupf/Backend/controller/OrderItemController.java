package com.groupf.Backend.controller;

import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/orderitems")
public class OrderItemController {

    private final OrderItemService orderItemService;

    @Autowired
    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping
    public List<OrderItem> getOrderItems(
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) Long productId
    ) {
        if (orderId != null && productId != null) {
            return orderItemService.getOrderItemsByOrderIdAndProductId(orderId, productId);
        } else if (orderId != null) {
            return orderItemService.getOrderItemsByOrderId(orderId);
        }
        return orderItemService.getAllOrderItems();
    }

    @PostMapping
    public ResponseEntity<OrderItem> addOrderItem(@RequestBody OrderItem orderItem) {
        return new ResponseEntity<>(orderItemService.addOrderItem(orderItem), HttpStatus.CREATED);
    }

    // Lägg till dessa endpoints
    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrderItem(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        orderItem.setId(id);
        return ResponseEntity.ok(orderItemService.addOrderItem(orderItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}
