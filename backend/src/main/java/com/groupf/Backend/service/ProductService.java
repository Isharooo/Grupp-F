package com.groupf.Backend.service;

import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderItemRepository;
import com.groupf.Backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long productId) {
        if (productId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ProductId saknas");
        }
        return productRepository.findProductById(productId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Produkt med id " + productId + " hittades inte"
                        )
                );
    }


    public List<Product> getAllProductsByCategory(String category) {
        if (category == null || category.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category måste anges");
        }
        return productRepository.findProductsByCategory(category)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Kategori '" + category + "' hittades inte"
                        )
                );
    }


    @Transactional
    public Product addProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product product) {
        validateProduct(product);
        Product existing = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Produkt med id " + id + " hittades inte"
                        )
                );

        updateProductFields(existing, product);
        return productRepository.save(existing);
    }

    private void validateProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required.");
        }
        if (product.getArticleNumber() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Article number is required.");
        }
        if (product.getPrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price is required.");
        }
        if (product.getCategoryId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required.");
        }
    }


    private void updateProductFields(Product existing, Product updated) {
        if (updated.getArticleNumber() != null
                && !Objects.equals(existing.getArticleNumber(), updated.getArticleNumber())) {
            existing.setArticleNumber(updated.getArticleNumber());
        }
        if (updated.getName() != null
                && !updated.getName().isBlank()
                && !Objects.equals(existing.getName(), updated.getName())) {
            existing.setName(updated.getName());

        }
        if (updated.getWeight() != null
                && !updated.getWeight().isBlank()
                && !Objects.equals(existing.getWeight(), updated.getWeight())) {
            existing.setWeight(updated.getWeight());
        }
        if (updated.getPrice() != null
                && !Objects.equals(existing.getPrice(), updated.getPrice())) {
            existing.setPrice(updated.getPrice());
        }
        if (updated.getImage() != null
                && !updated.getImage().isBlank()
                && !Objects.equals(existing.getImage(), updated.getImage())) {
            existing.setImage(updated.getImage());
        }
        if (updated.getCategoryId() != null
                && !Objects.equals(existing.getCategoryId(), updated.getCategoryId())) {
            existing.setCategoryId(updated.getCategoryId());
        }
    }

    public Page<Product> getProductsPaginated(int page, int size, String search, Long categoryId) {
        PageRequest pageRequest = PageRequest.of(page, size);

        // If both search and category are provided
        if (search != null && !search.isEmpty() && categoryId != null) {
            return productRepository.findByNameContainingIgnoreCaseAndCategoryId(search, categoryId, pageRequest);
        }

        // If only search is provided
        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search, pageRequest);
        }

        // If only category is provided
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId, pageRequest);
        }

        // No filters - return all products with pagination
        return productRepository.findAll(pageRequest);
    }

    public void deleteProduct(Long id) {
        List<OrderItem> orderItems = orderItemRepository.findByProductId(id);
        if (!orderItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Product is in use by orders and cannot be deleted.");
        }
        productRepository.deleteById(id);
    }

    public boolean existsByArticleNumber(Long articleNumber) {
        return productRepository.existsByArticleNumber(articleNumber);
    }
}
