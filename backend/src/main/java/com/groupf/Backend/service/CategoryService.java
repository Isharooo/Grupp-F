package com.groupf.Backend.service;

import com.groupf.Backend.model.Category;
import com.groupf.Backend.model.Product;
import com.groupf.Backend.repository.CategoryRepository;
import com.groupf.Backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Sort;


import java.util.List;
import java.util.Objects;
import jakarta.transaction.Transactional;

/**
 * Service class for managing categories.
 * Handles creating, updating, deleting, and reordering categories.
 * Also makes sure that products are moved to a fallback category ("noCategory") if their category is deleted.
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    /**
     * Constructs a new CategoryService with the given repositories.
     * Used by Spring to inject dependencies for managing categories and products.
     *
     * @param categoryRepository the repository for accessing category data
     * @param productRepository the repository for accessing product data
     */
    @Autowired
    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    /**
     * Adds a new category to the system.
     * Throws an error if a category with the same name already exists.
     *
     * @param category the category to add
     * @return the saved category
     */
    @Transactional
    public Category addCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kategorinamn finns redan.");
        }
        return categoryRepository.save(category);
    }

    /**
     * Returns all categories sorted by their order index.
     *
     * @return a list of categories
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll(Sort.by("orderIndex"));
    }

    /**
     * Deletes a category and moves its products to the fallback category named "noCategory".
     * Throws a runtime exception if the fallback category is missing.
     *
     * @param id the ID of the category to delete
     */
    @Transactional
    public void deleteCategory(Long id) {
        Category noCategory = categoryRepository.findAll().stream()
                .filter(cat -> "noCategory".equalsIgnoreCase(cat.getName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("noCategory category missing!"));

        List<Product> products = productRepository.findAll().stream()
                .filter(p -> id.equals(p.getCategoryId()))
                .toList();

        for (Product p : products) {
            p.setCategoryId(noCategory.getId());
            productRepository.save(p);
        }

        categoryRepository.deleteById(id);
    }

    /**
     * Updates the name of an existing category.
     * Ignores empty or unchanged names.
     *
     * @param id       the ID of the category to update
     * @param category the updated data
     * @return the updated category
     */
    public Category updateCategory(Long id, Category category) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        if (category.getName() != null && !category.getName().isEmpty() && !Objects.equals(existingCategory.getName(), category.getName())) {
            existingCategory.setName(category.getName());
        }

        return categoryRepository.save(existingCategory);
    }

    /**
     * Updates the order and name (if changed) for a list of categories.
     * Throws an error if any of the given categories cannot be found.
     *
     * @param categories the updated list of categories with new orderIndex values
     */
    @Transactional
    public void reorderCategories(List<Category> categories) {
        System.out.println("Reached reorderCategories");
        for (Category updated : categories) {
            Category existing = categoryRepository.findById(updated.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
            existing.setOrderIndex(updated.getOrderIndex());
            if (updated.getName() != null && !updated.getName().isBlank()
                    && !Objects.equals(existing.getName(), updated.getName())) {
                existing.setName(updated.getName());
            }
            categoryRepository.save(existing);
            System.out.println("Updating category: id=" + updated.getId() +
                    ", name=" + updated.getName() +
                    ", orderIndex=" + updated.getOrderIndex());

        }
    }
}
