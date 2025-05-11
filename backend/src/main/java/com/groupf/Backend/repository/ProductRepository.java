package com.groupf.Backend.repository;

import com.groupf.Backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.visible = true")
    List<Product> findAllVisibleProducts();

    @Query("SELECT p FROM Product p WHERE p.id = ?1")
    Optional<Product> findProductById(Long productId);

    @Query("SELECT p FROM Product p WHERE p.categoryId = ?1")
    Optional<List<Product>> findProductsByCategory(String category);

    //behövs sql?

    Page<Product> findByVisibleTrue(Pageable pageable);
    Page<Product> findByVisibleTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsByArticleNumber(Long articleNumber);
    Page<Product> findByVisibleTrueAndCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByVisibleTrueAndNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId, Pageable pageable);



}
