package com.groupf.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Represents a customer order in the system.
 * Contains customer details, creation and shipping dates, and whether the order is completed.
 * Used to track and manage customer purchases.
 */
@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @Column(name = "send_date")
    private LocalDate sendDate;

    private boolean completed;

    @Column(name = "created_by")
    private String createdBy;
}
