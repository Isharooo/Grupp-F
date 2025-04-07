
package com.groupf.Backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "GRFood AB")
@Entity
@Data
public class Product {

    @Id
    private Long id;

    private String sku;

    private String name;

    @Column(name = "regular_price")
    private Double regularPrice;

    @Column(name = "sale_price")
    private Double salePrice;

    private Integer stock;

    private String categories;

    private String images;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double weight;

}

