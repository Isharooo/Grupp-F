package com.groupf.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor

/**
 * Represents a product in the catalog.
 * Includes identifying information, pricing, weight, image reference, and category.
 * The 'visible' flag is used to control whether the product should be shown to users.
 */
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_number")
    private Long articleNumber;

    private String name;

    private String weight;

    private Double price;

    private String image;

    @Column(name = "category_id")
    private Long categoryId;

    private boolean visible;
}

