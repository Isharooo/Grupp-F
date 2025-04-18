package com.groupf.Backend.service;

import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

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

    public Product updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        updateProductFields(existingProduct, product);

        return productRepository.save(existingProduct);
    }

    //hjälpmetod med checks overkill?
    private void updateProductFields(Product existing, Product updated) {
        if (updated.getArticleNumber() != null && !Objects.equals(existing.getArticleNumber(), updated.getArticleNumber()))
            existing.setArticleNumber(updated.getArticleNumber());

        if (updated.getName() != null && !updated.getName().isEmpty() && !Objects.equals(existing.getName(), updated.getName()))
            existing.setName(updated.getName());

        if (updated.getWeight() != null && !updated.getWeight().isEmpty() && !Objects.equals(existing.getWeight(), updated.getWeight()))
            existing.setWeight(updated.getWeight());

        if (updated.getPrice() != null && !Objects.equals(existing.getPrice(), updated.getPrice()))
            existing.setPrice(updated.getPrice());

        if (updated.getImage() != null && !updated.getImage().isEmpty() && !Objects.equals(existing.getImage(), updated.getImage()))
            existing.setImage(updated.getImage());

        if (updated.getCategoryId() != null && !Objects.equals(existing.getCategoryId(), updated.getCategoryId()))
            existing.setCategoryId(updated.getCategoryId());
    }


}
