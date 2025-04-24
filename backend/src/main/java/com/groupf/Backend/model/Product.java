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
}

