package com.groupf.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single item within an order.
 * Contains references to both the product and the order, as well as quantity and price at the time of sale.
 * Used to build the contents of an order and manage inventory and sales tracking.
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "product_id")
    private Long productId;
    private Long quantity;
    @Column(name = "sale_price")
    private Double salePrice;


}
