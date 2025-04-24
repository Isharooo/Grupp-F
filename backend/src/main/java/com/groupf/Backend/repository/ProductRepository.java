package com.groupf.Backend.repository;

import com.groupf.Backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.id = ?1")
    Optional<Product> findProductById(Long productId);

    /*@Query("SELECT p FROM Product p WHERE p.categories = ?1")
    Optional<List<Product>> findProductsByCategory(String category);*/

    //behövs sql?
    boolean existsByName(String name);
}
