package com.groupf.Backend.service;

import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    //behöver inte transactional?
    @Transactional
    public Product getProductById(Long productId) {
        return productRepository.findProductById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    /*@Transactional
    public List<Product> getAllProductsByCategory(String category) {
        return productRepository.findProductsByCategory(category)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }*/


    public Product addProduct(Product product) {
        if(productRepository.existsByName(product.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product with that name already exists.");
        }
        return productRepository.save(product);
    }


}
