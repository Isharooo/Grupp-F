package com.groupf.Backend.service;

import com.groupf.Backend.model.OrderItem;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.OrderItemRepository;
import com.groupf.Backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

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
    public Product updateProduct(Product updatedProduct) {
        // Hämta befintlig produkt
        Product existing = productRepository.findById(updatedProduct.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Uppdatera fälten
        existing.setName(updatedProduct.getName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setArticleNumber(updatedProduct.getArticleNumber());
        existing.setImage(updatedProduct.getImage());
        existing.setWeight(updatedProduct.getWeight());
        existing.setCategoryId(updatedProduct.getCategoryId());
        existing.setVisible(updatedProduct.isVisible()); // <-- Detta är viktigt!
        // Spara och returnera
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



    public Page<Product> getVisibleProductsPaginated(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            // Om du har en sådan query i din repository
            return productRepository.findByVisibleTrueAndNameContainingIgnoreCase(search, pageable);
        } else {
            return productRepository.findByVisibleTrue(pageable);
        }
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

    public List<Product> getVisibleProducts() {
        return productRepository.findAllVisibleProducts();
    }
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
}
