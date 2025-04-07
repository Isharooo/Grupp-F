package com.groupf.Backend.repository;

import com.groupf.Backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public class ProductRepository implements JpaRepository<Product,long> {
}
