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

/**
 * Service class that handles logic related to products.
 * Provides functionality to create, update, delete, retrieve and paginate products.
 * Also includes validation and visibility filters.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    /**
     * Constructs a new ProductService with the given repositories.
     *
     * @param productRepository repository used to access product data
     * @param orderItemRepository repository used to check product usage in orders
     */
    @Autowired
    public ProductService(ProductRepository productRepository, OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * Retrieves all products in the system.
     *
     * @return list of all Product objects
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Finds a product by its ID.
     *
     * @param productId the ID of the product
     * @return the matching Product object
     * @throws ResponseStatusException if productId is null or the product is not found
     */
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

    /**
     * Retrieves all products that belong to a given category.
     *
     * @param category the name of the category
     * @return list of Product objects
     * @throws ResponseStatusException if category is blank or not found
     */
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

    /**
     * Adds a new product to the system.
     * Performs validation before saving.
     *
     * @param product the product to be added
     * @return the saved Product object
     * @throws ResponseStatusException if validation fails
     */
    @Transactional
    public Product addProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    /**
     * Updates an existing product with new values.
     *
     * @param updatedProduct the product containing updated data
     * @return the updated Product object
     * @throws RuntimeException if the product is not found
     */
    @Transactional
    public Product updateProduct(Product updatedProduct) {
        Product existing = productRepository.findById(updatedProduct.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(updatedProduct.getName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setArticleNumber(updatedProduct.getArticleNumber());
        existing.setImage(updatedProduct.getImage());
        existing.setWeight(updatedProduct.getWeight());
        existing.setCategoryId(updatedProduct.getCategoryId());
        existing.setVisible(updatedProduct.isVisible());
        return productRepository.save(existing);
    }

    /**
     * Validates the given product before saving.
     * Ensures that required fields like name, article number, price and category are not null or empty.
     *
     * @param product the product to validate
     * @throws ResponseStatusException if any required field is missing or invalid
     */
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

    /**
     * Retrieves a paginated list of visible products based on optional filters.
     *
     * @param page the page number (zero-based)
     * @param size the number of products per page
     * @param search optional search keyword for product names
     * @param categoryId optional category filter
     * @return a page of filtered Product objects
     */
    public Page<Product> getVisibleProductsPaginated(int page, int size, String search, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size);

        if (search != null && !search.isEmpty() && categoryId != null) {
            return productRepository.findByVisibleTrueAndNameContainingIgnoreCaseAndCategoryId(search, categoryId, pageable);
        } else if (search != null && !search.isEmpty()) {
            return productRepository.findByVisibleTrueAndNameContainingIgnoreCase(search, pageable);
        } else if (categoryId != null) {
            return productRepository.findByVisibleTrueAndCategoryId(categoryId, pageable);
        } else {
            return productRepository.findByVisibleTrue(pageable);
        }
    }

    /**
     * Deletes a product by its ID if it's not used in any orders.
     *
     * @param id the ID of the product to delete
     * @throws ResponseStatusException if the product is referenced by any order items
     */
    public void deleteProduct(Long id) {
        List<OrderItem> orderItems = orderItemRepository.findByProductId(id);
        if (!orderItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Product is in use by orders and cannot be deleted.");
        }
        productRepository.deleteById(id);
    }

    /**
     * Checks if a product exists with the given article number.
     *
     * @param articleNumber the article number to check
     * @return true if a product exists, false otherwise
     */
    public boolean existsByArticleNumber(Long articleNumber) {
        return productRepository.existsByArticleNumber(articleNumber);
    }

    /**
     * Retrieves all products that are marked as visible.
     *
     * @return list of visible Product objects
     */
    public List<Product> getVisibleProducts() {
        return productRepository.findAllVisibleProducts();
    }

    /**
     * Finds a product by its ID and returns it as an Optional.
     *
     * @param id the product ID
     * @return Optional containing the product if found, or empty otherwise
     */
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
}