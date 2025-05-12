package com.groupf.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a category for grouping products.
 * Each category has a name and a custom display order (orderIndex) used for sorting.
 * Used to help organize the product catalog into logical sections.
 */
@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "namn")
    private String name;

    @Column(name = "order_index")
    private Integer orderIndex;
}
